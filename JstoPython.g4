grammar JstoPython;
/*
 * Parser Rules
 */

start                       : methodDeclarations? | EOF ;
methodDeclarations          : methodDeclaration+ ;
methodDeclaration           : methodHeader methodBody ;
methodHeader                : 'def' methodName '(' ')' ':' NEWLINE ; 
methodBody                  : statement* ;
statement                   : emdeddedStatement commentText? NEWLINE* ;
emdeddedStatement
                            : localVariableDeclaration
                            | methodCall
                            | commentText
                             ;

localVariableDeclaration    : variableName '=' variableValue ;
methodCall                  : methodName '(' ')' ;
methodName                  : WORD ;
variableName                : WORD ;
variableValue
                            : BOOL 
                            | INT
                            | STRING
                            ;
commentText                 : COMMENT ;

/*
 * Lexer Rules
 */

INT                         : ('-')? [0-9]+;
BOOL                        : 'True' | 'False' ;
STRING                      : '"' .? '"' ;
WORD                        : [a-zA-Z] [a-zA-Z0-9]* ;
WHITESPACE                  : (' ')+ -> skip ;
NEWLINE                     : ('\r'? '\n' | '\r')+ ;
COMMENT                     : '#' ~[\r\n\f]* ;
ANY                         : . ;