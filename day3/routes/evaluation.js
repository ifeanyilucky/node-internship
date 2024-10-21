const express = require('express');
const router = express.Router();
const { Rule, Variable } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { variable } = req.query;
    if (!variable) {
      return res.status(400).json({ message: 'Variable parameter is required' });
    }


    const decodedVariables = JSON.parse(Buffer.from(variable, 'base64').toString());


    const [rules, dbVariables] = await Promise.all([
      Rule.findAll(),
      Variable.findAll()
    ]);


    const variableTypeMap = dbVariables.reduce((map, v) => {
      map[v.name] = v.type;
      return map;
    }, {});

    const castedVariables = Object.entries(decodedVariables).reduce((obj, [key, value]) => {
      if (variableTypeMap[key]) {
        switch (variableTypeMap[key]) {
          case 'INTEGER':
            obj[key] = parseInt(value, 10);
            break;
          case 'FLOAT':
            obj[key] = parseFloat(value);
            break;
          case 'STRING':
            obj[key] = String(value);
            break;
          default:
            obj[key] = value;
        }
      }
      return obj;
    }, {});

    
    const results = rules.map(rule => {
      try {
       
        const conditionFunc = new Function(...Object.keys(castedVariables), `return ${rule.condition}`);
        
       
        const conditionMet = conditionFunc(...Object.values(castedVariables));

        if (conditionMet) {
          return {
            rule_id: rule.id,
            result: rule.action
          };
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
      return null;
    }).filter(Boolean);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
