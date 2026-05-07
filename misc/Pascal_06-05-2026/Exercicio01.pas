// calcular o resultado de n° onde n e x (º) são numeros inteiros positivos informados pelo usuario
// exemplo: n = 2 e x = 3, o valor 8 deverá ser exibido. Obs: Se x = 0, o resultado deve ser 1.
program Exercicio01;
var n, x, resultado, i: integer;
begin
    writeln('Digite um numero inteiro positivo para n:');
    readln(n);
    writeln('Digite um numero inteiro positivo para x:');
    readln(x);
    i:= 0;
    resultado := 1;
    while i < x do 
    begin
        resultado := resultado * n;
        i := i + 1;
    end;
    writeln('O resultado de ', n, ' elevado a ', x, ' eh: ', resultado);
end.