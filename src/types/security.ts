export interface AttackLog {
  ip: string;
  type: string;
  endpoint: string;
  time: string;
}

export interface AttackStat {
  attack_type: string;
  count: number;
}

export interface SecurityState {
  logs: AttackLog[];
  stats: AttackStat[];
  loading: boolean;
  error: string | null;
}
