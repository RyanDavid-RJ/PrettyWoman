// Exercício 3: Escreva um programa que avalie as expressões abaixo para os valores dados para A, B, C, D e E. Experimente outros valores, observando que, em Pascal, valores booleanos não podem ser lidos nem escritos. Os valores de A e B deverão ser alterados dentro do programa ou deverá ser usada uma variável auxiliar inteira e uma conversão (sugestão de conversão: variável auxiliar = 0, A = false e se variável auxiliar = 1, A=true). [cite: 6]

program Exercicio3;
var
  A, B: boolean;
  auxA, auxB, C, D, E: integer;
  exp1, exp2, exp3, exp4: boolean;
begin
  // Valores iniciais definidos pelo problema
  C := 33;
  D := 47;
  E := 48;
  
  // Leitura e conversão para A
  writeln('Digite 1 para A=true ou 0 para A=false: ');
  readln(auxA);
  if auxA = 1 then A := true else A := false;
  
  // Leitura e conversão para B
  writeln('Digite 1 para B=true ou 0 para B=false: ');
  readln(auxB);
  if auxB = 1 then B := true else B := false;
  
  // Avaliação das expressões
  exp1 := A or (B and ((C + 1 * 2) <= 100));
  exp2 := B or (D < E) or (not (D > C));
  exp3 := ((51 div 2) - 10) >= 10;
  exp4 := ((C mod 5) * 20) < (2 * D);
  
  writeln('--- Resultados das Expressoes ---');
  // Como Pascal padrão não imprime booleanos diretamente com writeln, 
  // fazemos a conversão inversa para exibir o resultado.
  if exp1 then writeln('Exp 1: Verdadeiro') else writeln('Exp 1: Falso');
  if exp2 then writeln('Exp 2: Verdadeiro') else writeln('Exp 2: Falso');
  if exp3 then writeln('Exp 3: Verdadeiro') else writeln('Exp 3: Falso');
  if exp4 then writeln('Exp 4: Verdadeiro') else writeln('Exp 4: Falso');
end.