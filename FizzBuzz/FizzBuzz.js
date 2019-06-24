for (var i = 1; i <= 100; i++) {

    if (i % 5 == 0 && i % 3 == 0) {
        WScript.Echo("FizzBuzz");
    } else if (i % 3 == 0) {
        WScript.Echo("Fizz");
    } else if (i % 3 == 0) {
        WScript.Echo("Buzz");
    } else {
        WScript.Echo(i);
    }
}
