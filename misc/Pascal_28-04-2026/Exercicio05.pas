// Exercício 5: Refazer o exercício 4, para calcular a média para N alunos, onde N é um número fornecido pelo usuário (condição de parada depende do valor de N, NÃO usar notal = -1) [cite: 7]

program Exercicio5;
var
  nota1, nota2, nota3, media: real;
  N, i: integer;
begin
  writeln('Digite a quantidade total de alunos (N): ');
  readln(N);
  
  for i := 1 to N do
  begin
    writeln('--- Notas do Aluno ', i, ' ---');
    writeln('Digite a 1a nota: ');
    readln(nota1);
    writeln('Digite a 2a nota: ');
    readln(nota2);
    writeln('Digite a 3a nota: ');
    readln(nota3);
    
    media := (nota1 + nota2 + nota3) / 3;
    writeln('Media do aluno ', i, ': ', media:0:2);
    writeln('');
  end;
  
  writeln('Calculo finalizado para os ', N, ' alunos.');
end.