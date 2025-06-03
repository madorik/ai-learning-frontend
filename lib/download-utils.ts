interface Problem {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

interface TestPaperData {
  subject: string;
  grade: string;
  difficulty: string;
  questionCount: string;
  questionType: string;
  includeExplanation: boolean;
  problems: Problem[];
}

// HTML을 PDF로 변환 (간단한 print 기능 사용)
export const downloadAsPDF = async (testPaperData: TestPaperData) => {
  try {
    // 새 창을 열어서 인쇄 가능한 HTML 생성
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('팝업이 차단되었습니다. 팝업을 허용해주세요.');
    }

    const htmlContent = generatePrintableHTML(testPaperData);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // 페이지 로드 완료 후 인쇄 대화상자 열기
    printWindow.onload = () => {
      printWindow.print();
      // 인쇄 후 창 닫기
      setTimeout(() => {
        printWindow.close();
      }, 100);
    };
    
  } catch (error) {
    console.error('PDF 다운로드 오류:', error);
    throw error; // 상위에서 처리하도록 throw
  }
};

// Word 문서 다운로드 (HTML 파일로 다운로드 - Word에서 열 수 있음)
export const downloadAsWord = (testPaperData: TestPaperData) => {
  try {
    const htmlContent = generateWordHTML(testPaperData);
    
    // Blob으로 파일 생성
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${testPaperData.grade}학년_${testPaperData.subject}_문제지_${new Date().toISOString().slice(0, 10)}.doc`;
    
    // 다운로드 실행
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // URL 정리
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Word 다운로드 오류:', error);
    throw error; // 상위에서 처리하도록 throw
  }
};

// 인쇄용 HTML 생성
const generatePrintableHTML = (data: TestPaperData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.grade}학년 ${data.subject} 문제지</title>
      <style>
        @media print {
          body { 
            margin: 0; 
            -webkit-print-color-adjust: exact; 
            color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
        
        body {
          font-family: 'Malgun Gothic', sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          margin: 0 0 10px 0;
          font-weight: bold;
        }
        
        .header .info {
          font-size: 14px;
          color: #666;
        }
        
        .problem {
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          page-break-inside: avoid;
        }
        
        .problem-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        
        .question {
          font-size: 14px;
          margin-bottom: 15px;
          line-height: 1.8;
        }
        
        .choices {
          margin-bottom: 15px;
        }
        
        .choice {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding: 5px;
          background-color: #f8f9fa;
          border-radius: 3px;
        }
        
        .choice-number {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .choice-text {
          font-size: 13px;
          flex: 1;
        }
        
        .explanation {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 5px;
          padding: 10px;
          margin-top: 10px;
        }
        
        .explanation-title {
          font-weight: bold;
          color: #1d4ed8;
          margin-bottom: 5px;
        }
        
        .explanation-text {
          font-size: 13px;
          line-height: 1.6;
        }
        
        .answer-section {
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        
        .answer-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .answer-item {
          display: flex;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .answer-number {
          font-weight: bold;
          width: 50px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.grade}학년 ${data.subject} 문제지</h1>
        <div class="info">
          난이도: ${data.difficulty} | 문제 수: ${data.questionCount}개 | 문제 유형: ${data.questionType}
        </div>
      </div>
      
      ${data.problems.map((problem, index) => `
        <div class="problem">
          <div class="problem-title">📖 문제 ${index + 1}</div>
          <div class="question">${problem.question}</div>
          
          <div class="choices">
            <strong>보기:</strong>
            ${problem.choices.map((choice, idx) => `
              <div class="choice">
                <span class="choice-number">${idx + 1}</span>
                <span class="choice-text">${choice}</span>
              </div>
            `).join('')}
          </div>
          
          ${data.includeExplanation ? `
            <div class="explanation">
              <div class="explanation-title">💡 해설:</div>
              <div class="explanation-text">${problem.explanation}</div>
            </div>
          ` : ''}
        </div>
      `).join('')}
      
      <div class="answer-section">
        <div class="answer-title">정답</div>
        ${data.problems.map((problem, index) => `
          <div class="answer-item">
            <span class="answer-number">문제 ${index + 1}:</span>
            <span>${problem.answer}</span>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
};

// Word용 HTML 생성 (더 간단한 형태)
const generateWordHTML = (data: TestPaperData): string => {
  return `
    <!DOCTYPE html>
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
    <head>
      <meta charset="UTF-8">
      <title>${data.grade}학년 ${data.subject} 문제지</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
          <w:DoNotPromptForConvert/>
          <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body {
          font-family: 'Malgun Gothic', sans-serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 24px;
          margin: 0 0 10px 0;
          font-weight: bold;
        }
        
        .problem {
          margin-bottom: 25px;
          padding: 15px;
          border: 1px solid #ddd;
        }
        
        .problem-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        
        .question {
          margin-bottom: 15px;
          line-height: 1.8;
        }
        
        .choice {
          margin-bottom: 5px;
          padding: 3px 0;
        }
        
        .explanation {
          background-color: #f0f8ff;
          border: 1px solid #bfdbfe;
          padding: 10px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.grade}학년 ${data.subject} 문제지</h1>
        <p>난이도: ${data.difficulty} | 문제 수: ${data.questionCount}개 | 문제 유형: ${data.questionType}</p>
      </div>
      
      ${data.problems.map((problem, index) => `
        <div class="problem">
          <div class="problem-title">문제 ${index + 1}</div>
          <div class="question">${problem.question}</div>
          
          <div class="choices">
            <strong>보기:</strong><br/>
            ${problem.choices.map((choice, idx) => `
              <div class="choice">${idx + 1}. ${choice}</div>
            `).join('')}
          </div>
          
          ${data.includeExplanation ? `
            <div class="explanation">
              <strong>해설:</strong><br/>
              ${problem.explanation}
            </div>
          ` : ''}
        </div>
      `).join('')}
      
      <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
        <h3 style="text-align: center;">정답</h3>
        ${data.problems.map((problem, index) => `
          <p>문제 ${index + 1}: ${problem.answer}</p>
        `).join('')}
      </div>
    </body>
    </html>
  `;
}; 