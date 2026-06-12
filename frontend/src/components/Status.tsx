import { Race } from '../api';

export function Status({ status }: { status: Race['status'] }) {
  return <em className={`status status-${status.toLowerCase()}`}>{status}</em>;
}
