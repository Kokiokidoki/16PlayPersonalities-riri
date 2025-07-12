// 16PlayPersonalities診断のメインロジック
// 質問データと結果データを管理し、診断処理を実行する

// グローバル変数
let questions = [];
let results = {};
let currentPageIndex = 0;
const questionsPerPage = 10;

// フォールバック用の質問データ（ファイル読み込みに失敗した場合）
const fallbackQuestions = [
  {"id": "E_01", "text": "大勢で出かけると、自分が中心になって場を盛り上げたくなる。", "pole": "E"},
  {"id": "I_01", "text": "グループで遊んでいても、時々一人になって頭を休める時間が必要だと感じる。", "pole": "I"},
  {"id": "N_01", "text": "遊びに行くなら、まだ行ったことのない未知の場所を選ぶことにワクワクする。", "pole": "N"},
  {"id": "S_01", "text": "遊びに行くなら、以前行って楽しかったお気に入りの場所を再訪したい。", "pole": "S"},
  {"id": "T_01", "text": "ボードゲームやスポーツをするなら、勝つための戦略を考えることに最も興奮する。", "pole": "T"},
  {"id": "F_01", "text": "遊びの場で一番大切なのは、勝ち負けよりも、みんなが楽しい気持ちでいられることだ。", "pole": "F"},
  {"id": "J_01", "text": "遊びに行く日の計画は、集合時間や場所だけでなく、大まかなタイムスケジュールまで決めておくと安心する。", "pole": "J"},
  {"id": "P_01", "text": "目的地だけ決めて、あとはその場の雰囲気で何をするか決めるのが、最高の遊び方だと思う。", "pole": "P"},
  {"id": "A_01", "text": "ゲームで負けても、「まあ、楽しかったからいいか」とすぐに気持ちを切り替えられる。", "pole": "A"},
  {"id": "T_resilience_01", "text": "ゲームで負けると、自分のプレイのどこが悪かったのか、つい真剣に考えてしまう。", "pole": "T_resilience"}
];

// フォールバック用の結果データ（ファイル読み込みに失敗した場合）
const fallbackResults = {
  "ENTJ": {
    "name": "戦略的リーダー",
    "description": "論理的で戦略的な思考を持つリーダータイプです。",
    "strengths": ["論理的思考", "戦略的計画", "リーダーシップ"],
    "weaknesses": ["感情的な配慮", "柔軟性の不足"]
  }
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('ページ読み込み開始');
    console.log('現在のページ:', currentPage);
    console.log('現在のURL:', window.location.href);
    console.log('パス:', window.location.pathname);
    
    if (currentPage === 'diagnosis.html' || currentPage === '') {
        // ルートページ（index.html）の場合も診断ページとして扱う
        if (currentPage === '') {
            console.log('ルートページを診断ページにリダイレクト');
            window.location.href = 'diagnosis.html';
            return;
        }
        console.log('診断ページを初期化');
        initializeDiagnosis();
    } else if (currentPage === 'result.html') {
        console.log('結果ページを初期化');
        initializeResult();
    }
});

// 診断ページの初期化
async function initializeDiagnosis() {
    try {
        console.log('診断ページ初期化開始');
        
        // 質問データを読み込み（複数のパスを試行）
        let questionsUrl = '';
        let response = null;
        let loadSuccess = false;
        
        // パス1: 現在のページのパスを基準とした相対パス
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        questionsUrl = basePath + 'questions.json';
        
        console.log('質問データ読み込み開始 (パス1):', questionsUrl);
        
        try {
            response = await fetch(questionsUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                questions = await response.json();
                loadSuccess = true;
                console.log('パス1で成功');
            }
        } catch (error) {
            console.log('パス1で失敗、パス2を試行');
        }
        
        if (!loadSuccess) {
            // パス2: ルートパスからの相対パス
            questionsUrl = '/questions.json';
            console.log('質問データ読み込み開始 (パス2):', questionsUrl);
            
            try {
                response = await fetch(questionsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    questions = await response.json();
                    loadSuccess = true;
                    console.log('パス2で成功');
                }
            } catch (error2) {
                console.log('パス2で失敗、パス3を試行');
            }
        }
        
        if (!loadSuccess) {
            // パス3: 現在のディレクトリからの相対パス
            questionsUrl = './questions.json';
            console.log('質問データ読み込み開始 (パス3):', questionsUrl);
            
            try {
                response = await fetch(questionsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    questions = await response.json();
                    loadSuccess = true;
                    console.log('パス3で成功');
                }
            } catch (error3) {
                console.log('パス3で失敗、フォールバックデータを使用');
            }
        }
        
        if (!loadSuccess) {
            // フォールバックデータを使用
            questions = fallbackQuestions;
            console.log('フォールバックデータを使用:', questions.length, '件');
        }
        
        // デバッグ情報
        console.log('質問データ読み込み完了:', questions.length, '件');
        
        // 最初のページを表示
        displayCurrentPage();
        
        // 進捗カウンターを更新
        updateProgress();
        
        console.log('診断ページ初期化完了');
        
    } catch (error) {
        console.error('診断ページ初期化でエラーが発生しました:', error);
        console.error('エラー詳細:', error.message);
        
        // フォールバックデータを使用
        questions = fallbackQuestions;
        console.log('エラーによりフォールバックデータを使用:', questions.length, '件');
        
        // 最初のページを表示
        displayCurrentPage();
        
        // 進捗カウンターを更新
        updateProgress();
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
        
        // 結果データを読み込み（複数のパスを試行）
        let resultsUrl = '';
        let response = null;
        let loadSuccess = false;
        
        // パス1: 現在のページのパスを基準とした相対パス
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        resultsUrl = basePath + 'results.json';
        
        console.log('結果データ読み込み開始 (パス1):', resultsUrl);
        
        try {
            response = await fetch(resultsUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                results = await response.json();
                loadSuccess = true;
                console.log('パス1で成功');
            }
        } catch (error) {
            console.log('パス1で失敗、パス2を試行');
        }
        
        if (!loadSuccess) {
            // パス2: ルートパスからの相対パス
            resultsUrl = '/results.json';
            console.log('結果データ読み込み開始 (パス2):', resultsUrl);
            
            try {
                response = await fetch(resultsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    results = await response.json();
                    loadSuccess = true;
                    console.log('パス2で成功');
                }
            } catch (error2) {
                console.log('パス2で失敗、パス3を試行');
            }
        }
        
        if (!loadSuccess) {
            // パス3: 現在のディレクトリからの相対パス
            resultsUrl = './results.json';
            console.log('結果データ読み込み開始 (パス3):', resultsUrl);
            
            try {
                response = await fetch(resultsUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    results = await response.json();
                    loadSuccess = true;
                    console.log('パス3で成功');
                }
            } catch (error3) {
                console.log('パス3で失敗、フォールバックデータを使用');
            }
        }
        
        if (!loadSuccess) {
            // フォールバックデータを使用
            results = fallbackResults;
            console.log('フォールバックデータを使用');
        }
        
        // デバッグ情報
        console.log('結果データ読み込み完了:', Object.keys(results).length, '件');
        
        // 結果を表示
        displayResult(typeCode);
        
    } catch (error) {
        console.error('結果ページ初期化でエラーが発生しました:', error);
        console.error('エラー詳細:', error.message);
        
        // フォールバックデータを使用
        results = fallbackResults;
        console.log('エラーによりフォールバックデータを使用');
        
        // 結果を表示
        displayResult(typeCode);
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