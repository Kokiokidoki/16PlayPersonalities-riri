// 16PlayPersonalities診断のメインロジック
// 質問データと結果データを管理し、診断処理を実行する

// グローバル変数
let questions = [];
let results = {};
let currentPageIndex = 0;
const questionsPerPage = 10;

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'diagnosis.html' || currentPage === '') {
        // ルートページ（index.html）の場合も診断ページとして扱う
        if (currentPage === '') {
            window.location.href = 'diagnosis.html';
            return;
        }
        initializeDiagnosis();
    } else if (currentPage === 'result.html') {
        initializeResult();
    }
});

// 診断ページの初期化
async function initializeDiagnosis() {
    try {
        // 質問データを読み込み（現在のページのパスを基準とした相対パス）
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const response = await fetch(basePath + 'questions.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        questions = await response.json();
        
        // デバッグ情報
        console.log('質問データ読み込み成功:', questions.length, '件');
        console.log('読み込みパス:', basePath + 'questions.json');
        
        // 最初のページを表示
        displayCurrentPage();
        
        // 進捗カウンターを更新
        updateProgress();
        
    } catch (error) {
        console.error('質問データの読み込みに失敗しました:', error);
        // エラーメッセージを表示
        const container = document.getElementById('questions-container');
        if (container) {
            container.innerHTML = '<div class="error-message">質問データの読み込みに失敗しました。ページを再読み込みしてください。</div>';
        }
    }
}



// 結果ページの初期化
async function initializeResult() {
    try {
        // URLパラメータからタイプコードを取得
        const urlParams = new URLSearchParams(window.location.search);
        const typeCode = urlParams.get('type');
        
        if (!typeCode) {
            window.location.href = 'index.html';
            return;
        }
        
        // 結果データを読み込み（現在のページのパスを基準とした相対パス）
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const response = await fetch(basePath + 'results.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        results = await response.json();
        
        // デバッグ情報
        console.log('結果データ読み込み成功:', Object.keys(results).length, '件');
        console.log('読み込みパス:', basePath + 'results.json');
        
        // 結果を表示
        displayResult(typeCode);
        
    } catch (error) {
        console.error('結果データの読み込みに失敗しました:', error);
        // エラーメッセージを表示
        const container = document.querySelector('.result-container');
        if (container) {
            container.innerHTML = '<div class="error-message">結果データの読み込みに失敗しました。ページを再読み込みしてください。</div>';
        }
    }
}

// 現在のページの質問を表示する
function displayCurrentPage() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const startIndex = currentPageIndex * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(startIndex, endIndex);
    
    currentQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        const questionNumber = startIndex + index + 1;
        questionDiv.innerHTML = `
            <div class="question-text">
                <span class="question-number">${questionNumber}.</span>
                ${question.text}
            </div>
            <div class="answer-options">
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="1" required>
                    <span>全くそう思わない</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="2" required>
                    <span>そう思わない</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="3" required>
                    <span>あまりそう思わない</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="4" required>
                    <span>どちらでもない</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="5" required>
                    <span>ややそう思う</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="6" required>
                    <span>そう思う</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="q${question.id}" value="7" required>
                    <span>強くそう思う</span>
                </label>
            </div>
        `;
        container.appendChild(questionDiv);
    });
    
    // ページ情報を更新
    updatePageInfo();
    // ナビゲーションボタンを更新
    updateNavigationButtons();
}

// 進捗カウンターを更新する
function updateProgress() {
    const progressElement = document.getElementById('progress');
    if (!progressElement) return;
    
    const answeredCount = document.querySelectorAll('input[type="radio"]:checked').length;
    const totalCount = questions.length;
    
    progressElement.textContent = `${answeredCount}/${totalCount}`;
    
    // 進捗に応じて色を変更
    const progressPercentage = (answeredCount / totalCount) * 100;
    progressElement.style.color = progressPercentage >= 100 ? '#4CAF50' : '#2196F3';
}

// ページ情報を更新する
function updatePageInfo() {
    const currentPageElement = document.getElementById('current-page');
    const totalPagesElement = document.getElementById('total-pages');
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPageIndex + 1;
    }
    
    if (totalPagesElement) {
        totalPagesElement.textContent = Math.ceil(questions.length / questionsPerPage);
    }
}

// ナビゲーションボタンを更新する
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const resultButton = document.getElementById('result-button');
    
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    
    // 前のページボタン
    if (prevButton) {
        prevButton.style.display = currentPageIndex > 0 ? 'inline-block' : 'none';
    }
    
    // 次のページボタン
    if (nextButton) {
        nextButton.style.display = currentPageIndex < totalPages - 1 ? 'inline-block' : 'none';
    }
    
    // 結果ボタン
    if (resultButton) {
        resultButton.style.display = currentPageIndex === totalPages - 1 ? 'inline-block' : 'none';
    }
}

// ラジオボタンの変更を監視して進捗を更新
document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
        updateProgress();
    }
});

// 診断結果を計算する
function calculateResult() {
    // 未回答の質問があるかチェック
    const unansweredQuestions = questions.filter(q => {
        const radioButtons = document.querySelectorAll(`input[name="q${q.id}"]`);
        return !Array.from(radioButtons).some(radio => radio.checked);
    });
    
    if (unansweredQuestions.length > 0) {
        alert(`未回答の質問が${unansweredQuestions.length}個あります。すべての質問に回答してください。`);
        return;
    }
    
    // スコアを初期化
    const scores = {
        E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0, A: 0, T_resilience: 0
    };
    
    // 各質問の回答を集計
    questions.forEach(question => {
        const selectedRadio = document.querySelector(`input[name="q${question.id}"]:checked`);
        if (selectedRadio) {
            const answerValue = parseInt(selectedRadio.value);
            scores[question.pole] += answerValue;
        }
    });
    
    // タイプを判定
    const typeCode = determineType(scores);
    
    // 結果ページに遷移
    window.location.href = `result.html?type=${typeCode}`;
}

// タイプを判定する
function determineType(scores) {
    // 5つの次元で判定
    const dimensions = [
        { first: 'E', second: 'I' },
        { first: 'N', second: 'S' },
        { first: 'T', second: 'F' },
        { first: 'J', second: 'P' },
        { first: 'A', second: 'T_resilience' }
    ];
    
    let typeCode = '';
    
    dimensions.forEach(dimension => {
        if (scores[dimension.first] >= scores[dimension.second]) {
            typeCode += dimension.first;
        } else {
            typeCode += dimension.second;
        }
    });
    
    return typeCode;
}

// 結果を表示する
function displayResult(typeCode) {
    const result = results[typeCode];
    
    if (!result) {
        alert('診断結果が見つかりません。診断ページからやり直してください。');
        window.location.href = 'index.html';
        return;
    }
    
    // 結果を表示する要素を取得
    const typeNameElement = document.getElementById('type-name');
    const groupElement = document.getElementById('group');
    const descriptionElement = document.getElementById('description');
    
    if (typeNameElement) typeNameElement.textContent = result.typeName;
    if (groupElement) groupElement.textContent = result.group;
    if (descriptionElement) descriptionElement.textContent = result.description;
    
    // タイプコードも表示
    const typeCodeElement = document.getElementById('type-code');
    if (typeCodeElement) typeCodeElement.textContent = typeCode;
}

// 前のページに移動
function previousPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        displayCurrentPage();
        updateProgress();
    }
}

// 次のページに移動
function nextPage() {
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    
    // 現在のページの質問がすべて回答されているかチェック
    const startIndex = currentPageIndex * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
    const currentQuestions = questions.slice(startIndex, endIndex);
    
    const unansweredQuestions = currentQuestions.filter(q => {
        const radioButtons = document.querySelectorAll(`input[name="q${q.id}"]`);
        return !Array.from(radioButtons).some(radio => radio.checked);
    });
    
    if (unansweredQuestions.length > 0) {
        alert(`このページに未回答の質問が${unansweredQuestions.length}個あります。すべての質問に回答してください。`);
        return;
    }
    
    if (currentPageIndex < totalPages - 1) {
        currentPageIndex++;
        displayCurrentPage();
        updateProgress();
    }
}

// 診断をやり直す
function restartDiagnosis() {
    if (confirm('診断をやり直しますか？')) {
        window.location.href = 'index.html';
    }
}

// 診断ページに戻る
function backToDiagnosis() {
    window.location.href = 'diagnosis.html';
} 