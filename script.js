// 1. Configurar o cliente Supabase - Use suas chaves e URL reais
const supabaseUrl = 'https://qazjyzqptdcnuezllbpr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhemp5enFwdGRjbnVlemxsYnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDY4NTQsImV4cCI6MjA2NDEyMjg1NH0.H6v1HUH-LkHDH-WaaLQyN8GMeNLk0V27VJzHuXHin9M';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

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

// Função para extrair as partes do texto
function findUnderlinedText(text) {
    // Regex para encontrar texto entre underscores
    const regex = /_([^_]+)_/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}

// Adicionar um ouvinte de evento para o botão "Salvar"
document.getElementById('saveButton').addEventListener('click', async () => {
    const editor = document.getElementById('editor');
    // Pega o texto do editor, ignorando o HTML
    const rawText = editor.innerText;

    const extractedParts = findUnderlinedText(rawText);

    if (extractedParts.length === 0) {
        alert("Nenhuma parte do texto entre underlines foi encontrada para salvar.");
        return;
    }

    const dataToInsert = extractedParts.map(part => ({ 
        palavra: part,
        significado: ""}));

    // Substitua 'memoryhack' pelo nome da sua tabela no Supabase
    const { data, error } = await supabase
        .from('memoryhack')
        .insert(dataToInsert);

    if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
        alert('Ocorreu um erro ao salvar o texto.');
    } else {
        console.log('Dados salvos com sucesso:', data);
        alert('As partes do texto foram salvas com sucesso!');
    }
});


function formatFontSize() {
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const selectedSize = fontSizeSelect.value;
    document.execCommand('fontSize', false, selectedSize);
}