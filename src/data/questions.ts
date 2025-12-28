export interface Question {
  title: string;
  criteria: string;
  keywords: string[];
  unit?: string;
  quiz?: string;
}

// 데이터는 HTML 파일에서 런타임에 로드됩니다
let DATA: Question[] = [];
let QUIZ_DATA: Question[] = [];
let dataLoaded = false;
let loadPromise: Promise<void> | null = null;

export const loadQuestionsFromHTML = async (): Promise<void> => {
  if (dataLoaded) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const response = await fetch('/data-source.html');
      const html = await response.text();
      
      // Extract DATA JSON from <script id="data-json">
      // 정규식을 더 유연하게 수정 - 공백 무시
      const dataMatch = html.match(/<script\s+id=["']data-json["']\s+type=["']application\/json["']\s*>([\s\S]*?)<\/script>/i);
      if (dataMatch && dataMatch[1]) {
        try {
          const parsed = JSON.parse(dataMatch[1].trim());
          DATA = parsed;
          console.log(`Loaded ${DATA.length} questions from DATA`);
        } catch (e) {
          console.error('Failed to parse DATA JSON:', e);
        }
      } else {
        console.warn('DATA script tag not found, trying alternative pattern...');
        // 대체 패턴 시도 - const DATA = [...] 형태
        const altMatch = html.match(/const\s+DATA\s*=\s*(\[[\s\S]*?\]);/);
        if (altMatch && altMatch[1]) {
          try {
            DATA = JSON.parse(altMatch[1]);
            console.log(`Loaded ${DATA.length} questions from DATA (alt pattern)`);
          } catch (e) {
            console.error('Failed to parse DATA (alt):', e);
          }
        }
      }
      
      // Extract QUIZ_DATA JSON from <script id="quiz-data-json">
      const quizMatch = html.match(/<script\s+id=["']quiz-data-json["']\s+type=["']application\/json["']\s*>([\s\S]*?)<\/script>/i);
      if (quizMatch && quizMatch[1]) {
        try {
          QUIZ_DATA = JSON.parse(quizMatch[1].trim());
          console.log(`Loaded ${QUIZ_DATA.length} questions from QUIZ_DATA`);
        } catch (e) {
          console.error('Failed to parse QUIZ_DATA JSON:', e);
        }
      }
      
      dataLoaded = true;
    } catch (e) {
      console.error('Failed to load questions from HTML:', e);
    }
  })();

  return loadPromise;
};

export const getData = (): Question[] => DATA;
export const getQuizData = (): Question[] => QUIZ_DATA;
export const isDataLoaded = (): boolean => dataLoaded;

export const getUniqueUnits = (): string[] => {
  const units = DATA.map(q => q.unit || '').filter(u => u !== '');
  return Array.from(new Set(units)).sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });
};

// For backward compatibility
export { DATA, QUIZ_DATA };
