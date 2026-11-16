import type { ProtocolScenario, ProtocolId } from '../../types/protocol';
import { PROTOCOL_CATALOG } from '../catalog';
import { createDynamicScenario } from './generator';
import { httpsScenario } from './https';
import { dnsScenario } from './dns';
import { tcpScenario } from './tcp';
import { websocketScenario } from './websocket';
import { quicScenario } from './quic';

// Registry of curated scenarios
const CURATED_SCENARIOS: Record<string, ProtocolScenario> = {
  https: httpsScenario,
  dns: dnsScenario,
  tcp: tcpScenario,
  websocket: websocketScenario,
  quic: quicScenario,
};

// Build the full 39 protocol registry
export const PROTOCOL_REGISTRY: Record<string, ProtocolScenario> = {};

PROTOCOL_CATALOG.forEach((item) => {
  if (CURATED_SCENARIOS[item.id]) {
    PROTOCOL_REGISTRY[item.id] = CURATED_SCENARIOS[item.id];
  } else {
    PROTOCOL_REGISTRY[item.id] = createDynamicScenario(item);
  }
});

export const PROTOCOL_LIST = PROTOCOL_CATALOG.map((item) => PROTOCOL_REGISTRY[item.id]);

export function getProtocol(id: ProtocolId): ProtocolScenario {
  return PROTOCOL_REGISTRY[id] || httpsScenario;
}
