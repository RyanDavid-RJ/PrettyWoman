// Exercício 1: Faça um programa que leia uma quantidade indeterminada de idades (em anos) de pessoas e calcule e escreva a idade média. [cite: 1] O indicador de final da entrada de dados sera uma idade = 0. Usar a estrutura de repetição WHILE. [cite: 2]

program Exercicio1;
var
  idade, soma, contador: integer;
  media: real;
begin
  soma := 0;
  contador := 0;
  
  writeln('Digite as idades (digite 0 para encerrar):');
  readln(idade);
  
  while idade <> 0 do
  begin
    soma := soma + idade;
    contador := contador + 1;
    readln(idade);
  end;
  
  if contador > 0 then
  begin
    media := soma / contador;
    writeln('A idade media eh: ', media:0:2);
  end
  else
    writeln('Nenhuma idade valida foi digitada.');
end.