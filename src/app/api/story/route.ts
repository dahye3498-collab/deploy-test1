import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: '전생 API 서버가 정상적으로 작동 중입니다.', status: 'ready' });
}

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey.trim() === '') {
            console.error('Environment variable OPENAI_API_KEY is missing or empty');
            return NextResponse.json({
                error: 'OpenAI API 키가 설정되지 않았습니다. Vercel 설정(Settings > Environment Variables)에서 OPENAI_API_KEY를 추가하고 다시 배포(Redeploy)해 주세요.'
            }, { status: 500 });
        }

        const openai = new OpenAI({ apiKey: apiKey.trim() });
        const { name, title, year } = await req.json();

        if (!name || !title) {
            return NextResponse.json({ error: '필수 데이터가 누락되었습니다.' }, { status: 400 });
        }

        const prompt = `
당신은 전생의 모든 고리(Karma)를 꿰뚫어 보는 신비롭지만 약간은 '병맛' 기질이 있는 예언자입니다. 
사용자 이름 "${name}"의 잊혀진 기억을 불러내어, 다음 정보를 바탕으로 매우 상세하고, 때로는 어처구니없지만 매력적인 전생 이야기를 들려주세요.

[전생 정보]
- 전생 직업/종급: ${title}
- 활동 연대: ${year}

[요구 사항]
1. 문체: 신비롭고 고풍스러운 말투(~였습니다, ~했지요)를 유지하되, 중간중간 현대적인 '드립'이나 어처구니없는 상황 묘사(일명 병맛)를 섞어 바이럴 요소를 만드세요.
2. **전생의 삶**: 당시 당신의 일상과 주변 환경을 생동감 있게 묘사하세요. (예: 피라미드 설계자인데 돌을 옮기다 허리가 삐끗해서 3일간 누워만 있었다는 식의 사소하고 웃긴 디테일 포함)
3. **가장 임팩트 있는 사건**: 인생을 바꾼 결정적 순간을 서술하되, 그 이유가 매우 황당하거나 극적이어야 합니다.
4. **역사적 나비효과**: 당신의 말도 안 되는 행동 하나가 인류 역사를 어떻게 바꿨는지 '국뽕'이나 '반전'을 섞어 묘사하세요. (예: 당신이 흘린 국밥 국물이 훗날 나폴레옹의 전략 지도가 되었다는 식)
5. 작문: 충분히 길고 풍성하게(약 7~9문장 이상) 작성하세요. 유저가 '이게 왜 진짜지?' 싶을 정도로 그럴듯하면서도 웃기게 써야 합니다.

한국어로 답변하세요.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: '당신은 전생의 기억을 읽어주는 신비로운 예언자입니다.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.8,
            max_tokens: 500,
        });

        const story = response.choices[0].message.content;

        return NextResponse.json({ story });
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ error: '전생의 기억을 불러오는 데 실패했습니다.' }, { status: 500 });
    }
}
