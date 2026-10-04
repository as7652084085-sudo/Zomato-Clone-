import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container center">
      <h2>404 — Page nahi mila</h2>
      <Link to="/">← Home chalo</Link>
    </div>
  );
}
