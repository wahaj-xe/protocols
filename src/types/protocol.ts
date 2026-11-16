export type ProtocolGroup = 'all' | 'core' | 'application' | 'security';

export type ProtocolId =
  // Application (19)
  | 'http' | 'websocket' | 'webrtc' | 'sip' | 'rtsp' | 'rtmp'
  | 'dns' | 'dhcp' | 'ntp' | 'portal' | 'smtp' | 'pop3'
  | 'imap' | 'ftp' | 'smb' | 'proxy' | 'socks' | 'reverse' | 'modbus'
  // Core (11)
  | 'quic' | 'tcp' | 'udp' | 'ip' | 'bgp' | 'ipv6'
  | 'icmp' | 'igmp' | 'ethernet' | 'pppoe' | 'wifi'
  // Security (9)
  | 'https' | 'doh' | 'dnssec' | 'wpa3' | 'radius'
  | 'ssh' | 'tls' | 'wireguard' | 'ipsec'
  | string;

export type NodeRole = 'client' | 'gateway' | 'dns' | 'server' | 'ca';

export interface TopologyNode {
  id: string;
  label: string;
  role: NodeRole;
  ip: string;
  mac: string;
  x: number; // percentage 0-100 for responsive canvas
  y: number; // percentage 0-100
  activeState?: string;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface PacketField {
  id: string;
  name: string;
  value: string;
  byteRange: [number, number]; // [start, end] inclusive in hex buffer
  color: string;
  description: string;
}

export interface PacketLayer {
  name: string;
  protocol: string;
  color: string;
  fields: PacketField[];
}

export interface ProtocolStep {
  stepIndex: number;
  phase: string;
  title: string;
  summary: string;
  explanation: string;
  rfcNote?: string;
  from: string; // Node ID
  to: string;   // Node ID
  direction: 'forward' | 'backward';
  packetName: string;
  packetSummary: string;
  layers: PacketLayer[];
  rawHex: string; // Space-delimited or continuous hex
}

export interface ExamQuestion {
  id: string;
  protocolId: ProtocolId;
  title: string;
  instruction: string;
  targetNodes: string[];
  expectedSequence: {
    from: string;
    to: string;
    packetName: string;
    protocol: string;
  }[];
  availablePool: {
    id: string;
    from: string;
    to: string;
    packetName: string;
    protocol: string;
  }[];
}

export interface ProtocolScenario {
  id: ProtocolId;
  name: string;
  full: string;
  group: 'core' | 'application' | 'security';
  category: 'Application' | 'Transport' | 'Security';
  standard: string; // e.g. "RFC 8446 / RFC 9112"
  description: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  phases: string[];
  steps: ProtocolStep[];
  exam: ExamQuestion;
  isLocked?: boolean;
}

export interface CatalogItem {
  id: ProtocolId;
  name: string;
  full: string;
  group: 'core' | 'application' | 'security';
  standard: string;
  isLocked?: boolean;
}
