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
  {"id": "T_resilience_01", "text": "ゲームで負けると、自分のプレイのどこが悪かったのか、つい真剣に考えてしまう。", "pole": "T_resilience"},
  {"id": "E_02", "text": "新しい遊びを始める時は、まず周りの人を誘って一緒に楽しみたい。", "pole": "E"},
  {"id": "I_02", "text": "新しい遊びを始める時は、まず一人でじっくりとルールを理解してから人と遊びたい。", "pole": "I"},
  {"id": "N_02", "text": "遊びのルールは、その場で自由にアレンジして楽しむ方が面白い。", "pole": "N"},
  {"id": "S_02", "text": "遊びのルールは、きちんと決められた通りに従う方が安心できる。", "pole": "S"},
  {"id": "T_02", "text": "チーム戦では、メンバーの得意分野を分析して最適な配置を考えるのが楽しい。", "pole": "T"},
  {"id": "F_02", "text": "チーム戦では、メンバー全員が楽しめるように配慮するのが一番大切だ。", "pole": "F"},
  {"id": "J_02", "text": "遊びの道具は、使った後はきちんと整理整頓して片付ける。", "pole": "J"},
  {"id": "P_02", "text": "遊びの道具は、次に使う時にすぐ取り出せる場所に置いておく。", "pole": "P"},
  {"id": "A_02", "text": "遊びの最中に予期しないことが起きても、柔軟に対応できる。", "pole": "A"},
  {"id": "T_resilience_02", "text": "遊びの最中に予期しないことが起きると、計画が狂ってイライラしてしまう。", "pole": "T_resilience"},
  {"id": "E_03", "text": "パーティーやイベントでは、知らない人とも積極的に話しかける。", "pole": "E"},
  {"id": "I_03", "text": "パーティーやイベントでは、知っている人とだけ話す方が安心する。", "pole": "I"},
  {"id": "N_03", "text": "遊びのアイデアは、既存のものを組み合わせて新しい遊びを作り出す方が面白い。", "pole": "N"},
  {"id": "S_03", "text": "遊びのアイデアは、既に知っている確実に楽しい遊びを選ぶ方が安心する。", "pole": "S"},
  {"id": "T_03", "text": "ゲームの勝敗は、運よりも実力で決まるべきだと思う。", "pole": "T"},
  {"id": "F_03", "text": "ゲームの勝敗よりも、みんなで楽しい時間を過ごせたかどうかが大切だ。", "pole": "F"},
  {"id": "J_03", "text": "遊びの予定は、少なくとも数日前には決めておきたい。", "pole": "J"},
  {"id": "P_03", "text": "遊びの予定は、その日の気分で決めるのが一番楽しい。", "pole": "P"},
  {"id": "A_03", "text": "遊びの場で意見が対立しても、冷静に話し合って解決できる。", "pole": "A"},
  {"id": "T_resilience_03", "text": "遊びの場で意見が対立すると、自分の意見が正しいと主張したくなる。", "pole": "T_resilience"},
  {"id": "E_04", "text": "グループ活動では、リーダー役を引き受けることが多い。", "pole": "E"},
  {"id": "I_04", "text": "グループ活動では、サポート役に回ることが多い。", "pole": "I"},
  {"id": "N_04", "text": "遊びの場では、現実から離れて空想の世界に浸るのが楽しい。", "pole": "N"},
  {"id": "S_04", "text": "遊びの場では、現実的で具体的なことを楽しむ方が安心する。", "pole": "S"},
  {"id": "T_04", "text": "遊びのルールに矛盾があると、論理的に整理して解決したい。", "pole": "T"},
  {"id": "F_04", "text": "遊びのルールに矛盾があると、みんなが納得できる方法を探したい。", "pole": "F"},
  {"id": "J_04", "text": "遊びの準備は、余裕を持って早めに済ませておきたい。", "pole": "J"},
  {"id": "P_04", "text": "遊びの準備は、ギリギリになってからでも間に合う。", "pole": "P"},
  {"id": "A_04", "text": "遊びの場で失敗しても、笑い話にして場を和ませられる。", "pole": "A"},
  {"id": "T_resilience_04", "text": "遊びの場で失敗すると、恥ずかしさでしばらく立ち直れない。", "pole": "T_resilience"},
  {"id": "E_05", "text": "新しい遊びを提案する時は、みんなの前で自信を持って説明する。", "pole": "E"},
  {"id": "I_05", "text": "新しい遊びを提案する時は、まず親しい人に相談してからみんなに提案する。", "pole": "I"},
  {"id": "N_05", "text": "遊びの設定は、現実にはありえないような空想的な世界の方が面白い。", "pole": "N"},
  {"id": "S_05", "text": "遊びの設定は、現実的で身近な世界の方が親しみやすい。", "pole": "S"},
  {"id": "T_05", "text": "遊びの戦略を考える時は、客観的なデータや事実を重視する。", "pole": "T"},
  {"id": "F_05", "text": "遊びの戦略を考える時は、みんなの気持ちや関係性を重視する。", "pole": "F"},
  {"id": "J_05", "text": "遊びの時間配分は、きちんと決めておきたい。", "pole": "J"},
  {"id": "P_05", "text": "遊びの時間配分は、その場の雰囲気で臨機応変に決めたい。", "pole": "P"},
  {"id": "A_05", "text": "遊びの場で緊張する場面があっても、リラックスして楽しめる。", "pole": "A"},
  {"id": "T_resilience_05", "text": "遊びの場で緊張する場面があると、プレッシャーを感じて実力が出せない。", "pole": "T_resilience"},
  {"id": "E_06", "text": "遊びの場では、自分のアイデアを積極的に発言する。", "pole": "E"},
  {"id": "I_06", "text": "遊びの場では、他の人のアイデアをよく聞いてから自分の意見を言う。", "pole": "I"},
  {"id": "N_06", "text": "遊びのストーリーは、予想外の展開がある方が面白い。", "pole": "N"},
  {"id": "S_06", "text": "遊びのストーリーは、分かりやすく筋道が通っている方が安心する。", "pole": "S"},
  {"id": "T_06", "text": "遊びの評価は、明確な基準に基づいて客観的に行うべきだ。", "pole": "T"},
  {"id": "F_06", "text": "遊びの評価は、個人の努力や成長を認めることが大切だ。", "pole": "F"},
  {"id": "J_06", "text": "遊びの道具は、使用目的別に分類して保管する。", "pole": "J"},
  {"id": "P_06", "text": "遊びの道具は、使いたい時にすぐ取り出せる場所に置く。", "pole": "P"},
  {"id": "A_06", "text": "遊びの場で予期しないことが起きても、新しいチャレンジとして楽しめる。", "pole": "A"},
  {"id": "T_resilience_06", "text": "遊びの場で予期しないことが起きると、不安になって楽しめなくなる。", "pole": "T_resilience"},
  {"id": "E_07", "text": "グループで遊ぶ時は、みんなをまとめて盛り上げる役割を担いたい。", "pole": "E"},
  {"id": "I_07", "text": "グループで遊ぶ時は、個々のメンバーをサポートする役割を担いたい。", "pole": "I"},
  {"id": "N_07", "text": "遊びの世界観は、現実を超越した独創的な設定の方が魅力的だ。", "pole": "N"},
  {"id": "S_07", "text": "遊びの世界観は、現実に近い親しみやすい設定の方が安心する。", "pole": "S"},
  {"id": "T_07", "text": "遊びのルールは、論理的に矛盾がないように設計すべきだ。", "pole": "T"},
  {"id": "F_07", "text": "遊びのルールは、みんなが楽しめるように柔軟に調整すべきだ。", "pole": "F"},
  {"id": "J_07", "text": "遊びの進行は、予定通りに進める方が安心する。", "pole": "J"},
  {"id": "P_07", "text": "遊びの進行は、その場の雰囲気に応じて自由に変更する方が楽しい。", "pole": "P"},
  {"id": "A_07", "text": "遊びの場で批判されても、建設的な意見として受け止められる。", "pole": "A"},
  {"id": "T_resilience_07", "text": "遊びの場で批判されると、自分が否定されたように感じてしまう。", "pole": "T_resilience"},
  {"id": "E_08", "text": "新しい遊びを始める時は、みんなの前でデモンストレーションをする。", "pole": "E"},
  {"id": "I_08", "text": "新しい遊びを始める時は、まず少数の人と練習してから本番に臨む。", "pole": "I"},
  {"id": "N_08", "text": "遊びのアイデアは、既存の枠組みを超えた革新的なものが面白い。", "pole": "N"},
  {"id": "S_08", "text": "遊びのアイデアは、実績のある確実に楽しいものが安心できる。", "pole": "S"},
  {"id": "T_08", "text": "遊びの戦略は、データや分析に基づいて決定するべきだ。", "pole": "T"},
  {"id": "F_08", "text": "遊びの戦略は、チームの和や雰囲気を重視して決定するべきだ。", "pole": "F"},
  {"id": "J_08", "text": "遊びの準備は、チェックリストを作って漏れがないようにする。", "pole": "J"},
  {"id": "P_08", "text": "遊びの準備は、その場で必要なものを臨機応変に用意する。", "pole": "P"},
  {"id": "A_08", "text": "遊びの場で失敗しても、次に活かせる経験として前向きに捉えられる。", "pole": "A"},
  {"id": "T_resilience_08", "text": "遊びの場で失敗すると、同じ失敗を繰り返さないよう慎重になりすぎる。", "pole": "T_resilience"}
];

// フォールバック用の結果データ（ファイル読み込みに失敗した場合）
const fallbackResults = {
  "INTJ-A": {"typeName": "ゲーム設計者", "group": "遊びの戦略家", "description": "複雑な遊びのシステムを考案し、長期的な楽しみ方を計画する。トラブルにも動じず、常に最適な戦略を模索する冷静さを持つ。"},
  "INTJ-T": {"typeName": "ゲーム設計者", "group": "遊びの戦略家", "description": "複雑な遊びのシステムを考案し、長期的な楽しみ方を計画する。失敗を深く反省し、次こそは完璧な計画を立てようと情熱を燃やす。"},
  "INTP-A": {"typeName": "遊びの探求者", "group": "遊びの戦略家", "description": "遊びの仕組みやルールを深く分析し、新しい遊び方を見つけ出す。失敗を恐れず、自由な発想で遊びの可能性を広げる。"},
  "INTP-T": {"typeName": "遊びの探求者", "group": "遊びの戦略家", "description": "遊びの仕組みやルールを深く分析し、新しい遊び方を見つけ出す。完璧を求め、自分のアイデアが正しく評価されることを重視する。"},
  "ENTJ-A": {"typeName": "遊びの指揮官", "group": "遊びの戦略家", "description": "遊びの場を効率的に運営し、みんなを導いて最高の体験を提供する。自信に満ち、どんな状況でもリーダーシップを発揮する。"},
  "ENTJ-T": {"typeName": "遊びの指揮官", "group": "遊びの戦略家", "description": "遊びの場を効率的に運営し、みんなを導いて最高の体験を提供する。完璧を求め、自分の能力を証明することに情熱を燃やす。"},
  "ENTP-A": {"typeName": "遊びの革新者", "group": "遊びの戦略家", "description": "既存の遊びに新しいアイデアを加え、常に革新的な遊び方を提案する。失敗を恐れず、挑戦的な遊びを楽しむ。"},
  "ENTP-T": {"typeName": "遊びの革新者", "group": "遊びの戦略家", "description": "既存の遊びに新しいアイデアを加え、常に革新的な遊び方を提案する。自分の独創性が認められることを重視し、完璧なアイデアを追求する。"},
  "INFJ-A": {"typeName": "遊びの調和者", "group": "遊びの共感者", "description": "みんなが心から楽しめる遊びの場を作り、深い絆を育む。直感的に場の空気を読み、適切なタイミングでサポートする。"},
  "INFJ-T": {"typeName": "遊びの調和者", "group": "遊びの共感者", "description": "みんなが心から楽しめる遊びの場を作り、深い絆を育む。完璧な遊び体験を提供しようと努力し、自分の貢献が認められることを重視する。"},
  "INFP-A": {"typeName": "遊びの夢想家", "group": "遊びの共感者", "description": "空想的で独創的な遊びの世界を作り出し、みんなを魅了する。自由な発想で、現実を超越した遊び体験を提供する。"},
  "INFP-T": {"typeName": "遊びの夢想家", "group": "遊びの共感者", "description": "空想的で独創的な遊びの世界を作り出し、みんなを魅了する。自分の創造性が正しく理解されることを重視し、完璧な表現を追求する。"},
  "ENFJ-A": {"typeName": "遊びの啓発者", "group": "遊びの共感者", "description": "みんなの才能を引き出し、一人ひとりが輝ける遊びの場を作る。自然体でリーダーシップを発揮し、みんなを導く。"},
  "ENFJ-T": {"typeName": "遊びの啓発者", "group": "遊びの共感者", "description": "みんなの才能を引き出し、一人ひとりが輝ける遊びの場を作る。完璧な遊び体験を提供しようと努力し、自分の指導力が認められることを重視する。"},
  "ENFP-A": {"typeName": "遊びの冒険家", "group": "遊びの共感者", "description": "新しい遊びの可能性を発見し、みんなを未知の冒険に誘う。失敗を恐れず、自由な精神で遊びの世界を広げる。"},
  "ENFP-T": {"typeName": "遊びの冒険家", "group": "遊びの共感者", "description": "新しい遊びの可能性を発見し、みんなを未知の冒険に誘う。自分の独創性が認められることを重視し、完璧な遊び体験を追求する。"},
  "ISTJ-A": {"typeName": "遊びの実行者", "group": "遊びの実践者", "description": "確実で実用的な遊びを提供し、みんなが安心して楽しめる場を作る。経験に基づいた信頼できる遊び方を提案する。"},
  "ISTJ-T": {"typeName": "遊びの実行者", "group": "遊びの実践者", "description": "確実で実用的な遊びを提供し、みんなが安心して楽しめる場を作る。完璧な実行を求め、自分の信頼性が認められることを重視する。"},
  "ISFJ-A": {"typeName": "遊びの支援者", "group": "遊びの実践者", "description": "みんなのニーズに細かく気を配り、一人ひとりが快適に楽しめる環境を作る。自然体でサポート役を担う。"},
  "ISFJ-T": {"typeName": "遊びの支援者", "group": "遊びの実践者", "description": "みんなのニーズに細かく気を配り、一人ひとりが快適に楽しめる環境を作る。完璧なサポートを提供しようと努力し、自分の貢献が認められることを重視する。"},
  "ESTJ-A": {"typeName": "遊びの管理者", "group": "遊びの実践者", "description": "遊びの場を効率的に運営し、みんながルールを守って楽しく遊べる環境を作る。実践的なリーダーシップを発揮する。"},
  "ESTJ-T": {"typeName": "遊びの管理者", "group": "遊びの実践者", "description": "遊びの場を効率的に運営し、みんながルールを守って楽しく遊べる環境を作る。完璧な管理を求め、自分の能力が認められることを重視する。"},
  "ESFJ-A": {"typeName": "遊びの世話役", "group": "遊びの実践者", "description": "みんなが楽しく過ごせるよう細やかな気配りをし、温かい雰囲気の遊びの場を作る。自然体でみんなをまとめる。"},
  "ESFJ-T": {"typeName": "遊びの世話役", "group": "遊びの実践者", "description": "みんなが楽しく過ごせるよう細やかな気配りをし、温かい雰囲気の遊びの場を作る。皆が楽しめているか、自分の振る舞いは適切だったかを深く考え、場の調和を大切にする。"}
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