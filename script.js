function formatDoc(command, value = null) {
    if (command === 'createLink') {
        const url = prompt('Insira o URL:');
        if (url) {
            document.execCommand(command, false, url);
        }
    } else {
        document.execCommand(command, false, value);
    }
}