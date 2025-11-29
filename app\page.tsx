import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <p>Welcome. Please <Link href="/login">login</Link> or <Link href="/register">register</Link>.</p>
    </div>
  );
}
