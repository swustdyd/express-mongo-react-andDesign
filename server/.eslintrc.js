module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules":{
    // no-var
    "no-var": "error",
    // 要求或禁止 var 声明中的初始化
    "init-declarations": 2,
    // 强制使用单引号
    "quotes": ["error", "single"],
    // 要求或禁止使用分号而不是 ASI
    //"semi": ["error", "never"],
    // 禁止不必要的分号
    "no-extra-semi": "error",
    // 强制使用一致的换行风格
    "linebreak-style": ["error", "windows"],
    // 空格4个
    "indent": ["error", 4, {"SwitchCase": 1}],
    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
    "array-bracket-spacing": [2, "never"],
    // 在块级作用域外访问块内定义的变量是否报错提示
    "block-scoped-var": 0,
    // if while function 后面的{必须与if在同一行，java风格。
    "brace-style": [2, "1tbs", {"allowSingleLine": true}],
    // 双峰驼命名格式
    "camelcase": 2,
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    "comma-dangle": [2, "never"],
    // 控制逗号前后的空格
    "comma-spacing": [2, {"before": false, "after": true}],
    // 控制逗号在行尾出现还是在行首出现
    "comma-style": [2, "last"],
    // 圈复杂度
    "complexity": [2, 12],
    // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
    "computed-property-spacing": [2, "never"],
    // TODO 关闭 强制方法必须返回值，TypeScript强类型，不配置
    // "consistent-return": 0
    //要求 Switch 语句中有 Default 分支 (default-case)
    "default-case": 2,
    //禁止使用魔术数字 (no-magic-numbers)
    //"no-magic-numbers": [2, { "ignoreArrayIndexes": true }],
    //要求使用 Error 对象作为 Promise 拒绝的原因 (prefer-promise-reject-errors)
    "prefer-promise-reject-errors": 2,
    //禁止使用不带 await 表达式的 async 函数 (require-await)
    "require-await": 2,
    //要求箭头函数的参数使用圆括号 (arrow-parens)
    "arrow-parens": [2, "always"],
    //要求箭头函数体使用大括号 (arrow-body-style)
    "arrow-body-style": ["error", "always"],
    //要求箭头函数的箭头之前或之后有空格
    "arrow-spacing": "error",
    //建议使用const (prefer-const)
    "prefer-const": "error",
    "no-const-assign": "error",
    //只强制对象解构，不强制数组解构
    "prefer-destructuring": [2, {"object": true, "array": false}, {"enforceForRenamedProperties": false}]
  }
}