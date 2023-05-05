grammar JstoPython;

/*
 * Parser Rules
 */
start: methodDeclarations? EOF;
methodDeclarations: methodDeclaration+ ;
methodDeclaration: methodHeader methodBody ;
methodHeader: 'function' methodName '('methodDeclarationArguments?')';
methodDeclarationArguments: WORD (',' WORD)*;
methodBody: '{' statement* '}';
statement: embeddedStatement EOL? commentText?;
embeddedStatement:
    localVariableDeclaration
    | variableOperation 
    | condition
    | commentText
    | forCycle
    | whileCycle
    | cycleReservedWord
    | reservedMethodCall
    | methodCall;
reservedMethodCall: consoleLog '('methodCallAgruments?')';
consoleLog: CONSOLELOG;
cycleReservedWord: BREAK | CONTINUE;
whileCycle: WHILE '(' forCycleRule ')' methodBody;
forCycle:  forCycleHeader methodBody;
forCycleHeader: FOR '(' localVariableDeclaration? ';' forCycleRule? ';' variableOperation? ')';
forCycleRule: forCycleRulePart forCycleRuleOperation forCycleRulePart;
forCycleRulePart: (WORD | INT | FLOAT | BOOLEAN | STRING);
forCycleRuleOperation: COMPAREOPERATION;
localVariableDeclaration: variableType variableName (EQ variableValue)? ;
condition: conditionHeader methodBody conditionElse?;
conditionHeader: conditionHeaderLeft conditionRule conditionHeaderRight;
conditionHeaderLeft: IF '('(WORD | INT | FLOAT | BOOLEAN | STRING);
conditionRule: COMPAREOPERATION;
conditionHeaderRight: (WORD | INT | FLOAT | BOOLEAN | STRING)')';
conditionElse: ELSE methodBody;
methodCall: methodName '('methodCallAgruments')';
methodCallAgruments: (WORD | INT | FLOAT | BOOLEAN | STRING) (',' (WORD | INT | FLOAT | BOOLEAN | STRING))*;
commentText: COMMENT;
methodName: WORD;
variableType: 'let' | 'var' | 'const';
variableName: WORD;
variableOperation: leftOperationSide rightOperationSide;
leftOperationSide: WORD (EQOPS | EQ);
rightOperationSide: (('('? (MATHOPERATION | (WORD | INT | FLOAT | BOOLEAN | STRING))')'?) | '(' | ')')*;
variableValue: INT | BOOLEAN | STRING | FLOAT | WORD;

 /*
 * Lexer Rules
 */
CONSOLELOG: 'console.log';
BREAK: 'break';
CONTINUE: 'continue';
WHILE: 'while';
FOR: 'for';
IF: 'if';
ELSE: 'else';
EQ: '=';
EQOPS: PLUSEQ | MINUSEQ | MULTEQ | DIVEQ | REMAINDEREQ;
MATHOPERATION: PLUS | MINUS | MULT | POWER | DIV | INTDIV | REMAINDER;
INT: '-'? [0-9]+;
FLOAT: '-'? [0-9]+ '.' [0-9]+;
BOOLEAN: 'true' | 'false';
STRING: '"' .*? '"' ;
WORD: [a-zA-Z_] [a-zA-Z0-9_]* ;
WHITESPACE : (' '|'\t')+ -> skip ;
NEWLINE: ('\r'? '\n' | '\r')+ -> skip;
COMMENT: '//' ~[\r\n\f]* ;
EOL: ';';
COMPAREOPERATION: EQUALITY | STREQUALITY | INEQUALITY | STRINEQUALITY | LESS | LARGER | LESSOREQ | MOREOREQ;
fragment PLUS: '+';
fragment MINUS: '-';
fragment MULT: '*';
fragment POWER: '**';
fragment DIV: '/';
fragment INTDIV: '//';
fragment REMAINDER: '%';
fragment PLUSEQ: '+=';
fragment MINUSEQ: '-=';
fragment MULTEQ: '*=';
fragment DIVEQ: '/=';
fragment REMAINDEREQ: '%=';
fragment EQUALITY: '==';
fragment STREQUALITY: '===';
fragment INEQUALITY: '!=';
fragment STRINEQUALITY: '!==';
fragment LESS: '<';
fragment LARGER: '>';
fragment LESSOREQ: '<=';
fragment MOREOREQ: '>=';
