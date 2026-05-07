// Exercício 2: Dado o algoritmo abaixo: Escrever o programa em Pascal correspondente. [cite: 3] Para o valor 34 de entrada, qual (quais) a(s) mensagem(ns) exibida(s)? [cite: 4]

program Exercicio2;
var
  N1, i: integer;
begin
  writeln('Digite um numero inteiro positivo menor do que 100: ');
  readln(N1);
  
  for i := 27 to N1 do
  begin
    if (i mod 3) > 1 then
      writeln('Mensagem A')
    else
      writeln('Mensagem B');
  end;
end.

{ 
  RESPOSTA DA PERGUNTA TEÓRICA DO EXERCÍCIO 2:
  Para o valor 34 de entrada, o laço "for" vai de 27 até 34. 
  A condição "(i mod 3) > 1" só é verdadeira quando o resto da divisão por 3 for igual a 2.
  As mensagens exibidas serão:
  i = 27 (27 mod 3 = 0) -> Mensagem B
  i = 28 (28 mod 3 = 1) -> Mensagem B
  i = 29 (29 mod 3 = 2) -> Mensagem A
  i = 30 (30 mod 3 = 0) -> Mensagem B
  i = 31 (31 mod 3 = 1) -> Mensagem B
  i = 32 (32 mod 3 = 2) -> Mensagem A
  i = 33 (33 mod 3 = 0) -> Mensagem B
  i = 34 (34 mod 3 = 1) -> Mensagem B
}