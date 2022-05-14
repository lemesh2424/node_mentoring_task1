process.stdin.resume()

process.stdin.on('data', (data) => {
    process.stdout.write(reverseString(data.toString()));
    process.stdout.write('\n\n\n');
});

function reverseString(string) {
    return string.split('').reverse().join('').trim();
}