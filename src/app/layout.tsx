import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '전생 이야기 - 당신은 누구였을까요?',
    description: '당신의 이름을 입력하고 신비로운 전생의 기억을 찾아보세요.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
