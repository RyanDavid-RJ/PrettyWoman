// Exercício 4: Faça um programa para ler os valores de 3 notas por aluno, imprimir a média de cada aluno e o número de alunos. Depois do último aluno, notal = -1 (condição de parada).

program Exercicio4;
var
  nota1, nota2, nota3, media: real;
  numAlunos: integer;
begin
  numAlunos := 0;
  
  writeln('Digite a 1a nota do aluno (ou -1 para encerrar o programa): ');
  readln(nota1);
  
  while nota1 <> -1 do
  begin
    writeln('Digite a 2a nota: ');
    readln(nota2);
    writeln('Digite a 3a nota: ');
    readln(nota3);
    
    media := (nota1 + nota2 + nota3) / 3;
    numAlunos := numAlunos + 1;
    
    writeln('Media do aluno: ', media:0:2);
    writeln('--------------------------------------------------');
    
    writeln('Digite a 1a nota do proximo aluno (ou -1 para encerrar): ');
    readln(nota1);
  end;
  
  writeln('Numero total de alunos processados: ', numAlunos);
end.