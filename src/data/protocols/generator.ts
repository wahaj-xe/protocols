import type { ProtocolScenario, CatalogItem, ProtocolStep } from '../../types/protocol';

/**
 * Creates dynamic, high-fidelity protocol scenarios for any catalog item
 */
export function createDynamicScenario(item: CatalogItem): ProtocolScenario {
  const isSecurity = item.group === 'security';
  const isCore = item.group === 'core';

  // Define realistic nodes based on protocol role
  const clientLabel = item.id.includes('wifi') || item.id === 'wpa3' ? 'Wireless Station (STA)'
    : item.id === 'radius' ? 'Supplicant (Client)'
    : item.id === 'wireguard' ? 'VPN Peer A'
    : item.id === 'bgp' ? 'Autonomous System 64512'
    : 'Client Node';

  const serverLabel = item.id.includes('wifi') || item.id === 'wpa3' ? 'Access Point (AP / BSSID)'
    : item.id === 'radius' ? 'RADIUS Auth Server'
    : item.id === 'wireguard' ? 'VPN Gateway Peer B'
    : item.id === 'bgp' ? 'Autonomous System 64513'
    : `${item.name} Server`;

  const steps: ProtocolStep[] = [
    {
      stepIndex: 0,
      phase: 'Initiation & Discovery',
      title: `${item.name}: Initiation Request`,
      summary: `${clientLabel} emits protocol start request to ${serverLabel} according to ${item.standard}.`,
      explanation: `The conversation starts by negotiating protocol version, supported capabilities, and parameters for ${item.full}.`,
      rfcNote: `${item.standard}: Establishes the initial transport or session context before data transmission.`,
      from: 'client',
      to: 'server',
      direction: 'forward',
      packetName: `${item.name} Handshake / Hello`,
      packetSummary: `${item.name} [Flags: INIT, Standard: ${item.standard}]`,
      rawHex: '45 00 00 3c 1a 2b 40 00 40 06 c2 e1 c0 a8 01 64 0a 00 00 01 12 34 00 50 00 00 00 01 00 00 00 00 50 02 20 00 e1 22 00 00',
      layers: [
        {
          name: `${item.name} Control Header`,
          protocol: item.name,
          color: isSecurity ? '#c084fc' : isCore ? '#38bdf8' : '#34d399',
          fields: [
            { id: 'f_proto', name: 'Protocol', value: item.name, byteRange: [0, 3], color: '#38bdf8', description: `Standard ${item.name} header identifier` },
            { id: 'f_spec', name: 'Specification', value: item.standard, byteRange: [4, 7], color: '#f59e0b', description: 'RFC specification identifier' },
            { id: 'f_role', name: 'Direction', value: 'Client -> Server', byteRange: [8, 11], color: '#10b981', description: 'Initial transaction emission' },
          ],
        },
      ],
    },
    {
      stepIndex: 1,
      phase: 'Negotiation & Challenge',
      title: `${item.name}: Server Acknowledgment & Parameters`,
      summary: `${serverLabel} accepts session and replies with state parameters.`,
      explanation: `${serverLabel} verifies client credentials, allocates socket buffers, and issues cryptographic nonce or sequence identifier.`,
      rfcNote: `${item.standard}: Confirms peer readiness and locks in mutual encryption or routing state.`,
      from: 'server',
      to: 'client',
      direction: 'backward',
      packetName: `${item.name} Response / Challenge`,
      packetSummary: `${item.name} [Status: 200 OK / ACCEPT, Nonce: 0x8f3211a0]`,
      rawHex: '45 00 00 3c 2b 3c 40 00 3c 06 b1 d2 0a 00 00 01 c0 a8 01 64 00 50 12 34 00 00 00 02 00 00 00 02 50 12 20 00 d2 33 00 00',
      layers: [
        {
          name: `${item.name} Response Header`,
          protocol: item.name,
          color: '#34d399',
          fields: [
            { id: 'f_resp_status', name: 'Status Code', value: 'ACCEPTED (0x00)', byteRange: [0, 3], color: '#34d399', description: 'Server acceptance and readiness' },
            { id: 'f_nonce', name: 'Server Entropy', value: '0x8f3211a0', byteRange: [4, 7], color: '#c084fc', description: 'Session nonce or sequence sync' },
          ],
        },
      ],
    },
    {
      stepIndex: 2,
      phase: 'Active Exchange',
      title: `${item.name}: Data Transaction Payload`,
      summary: `Active bi-directional payload transmission between ${clientLabel} and ${serverLabel}.`,
      explanation: `Payload bytes flow reliably across the established connection with checksum validation and encapsulation.`,
      rfcNote: `${item.standard}: Core payload framing defined by the specification.`,
      from: 'client',
      to: 'server',
      direction: 'forward',
      packetName: `${item.name} Data Segment`,
      packetSummary: `${item.name} [Payload: ${item.full}, 512 Bytes]`,
      rawHex: '45 00 02 00 3c 4d 40 00 40 06 a0 c1 c0 a8 01 64 0a 00 00 01 12 34 00 50 00 00 00 03 00 00 00 03 50 18 20 00 c3 44 00 00 7b 22 70 72 6f 74 6f 63 6f 6c 22 3a 22 61 63 74 69 76 65 22 7d',
      layers: [
        {
          name: `${item.name} Payload`,
          protocol: item.name,
          color: '#f59e0b',
          fields: [
            { id: 'f_data_type', name: 'Frame Type', value: 'DATA (0x01)', byteRange: [0, 1], color: '#f59e0b', description: 'Active application message' },
            { id: 'f_len', name: 'Length', value: '512 bytes', byteRange: [2, 3], color: '#38bdf8', description: 'Transmitted payload size' },
          ],
        },
      ],
    },
    {
      stepIndex: 3,
      phase: 'Completion / Termination',
      title: `${item.name}: Transaction Complete`,
      summary: `Session finalized or persistent heartbeat established.`,
      explanation: `Both endpoints confirm successful receipt and either maintain keepalive state or gracefully terminate.`,
      rfcNote: `${item.standard}: Clean session closure or keep-alive heartbeat interval.`,
      from: 'server',
      to: 'client',
      direction: 'backward',
      packetName: `${item.name} Acknowledgment / Close`,
      packetSummary: `${item.name} [Success: 100%, State: STABLE]`,
      rawHex: '45 00 00 28 4d 5e 40 00 3c 06 9f b0 0a 00 00 01 c0 a8 01 64 00 50 12 34 00 00 00 04 00 00 00 04 50 10 20 00 b4 55 00 00',
      layers: [
        {
          name: `${item.name} State Finalizer`,
          protocol: item.name,
          color: '#10b981',
          fields: [
            { id: 'f_ack', name: 'Acknowledgment', value: 'SUCCESS (OK)', byteRange: [0, 3], color: '#10b981', description: 'Transaction confirmed' },
          ],
        },
      ],
    },
  ];

  return {
    id: item.id,
    name: `${item.name} (${item.full})`,
    full: item.full,
    group: item.group,
    category: isSecurity ? 'Security' : isCore ? 'Transport' : 'Application',
    standard: item.standard,
    description: `Interactive visual trace of ${item.name} (${item.full}). Governed by ${item.standard}, illustrating packet transmission, header structures, and sequence flow.`,
    nodes: [
      { id: 'client', label: clientLabel, role: 'client', ip: '192.168.1.100', mac: '02:42:ac:11:00:02', x: 20, y: 50, activeState: 'ACTIVE' },
      { id: 'server', label: serverLabel, role: 'server', ip: '10.0.0.1', mac: '02:42:ac:11:00:03', x: 80, y: 50, activeState: 'LISTENING' },
    ],
    links: [
      { id: 'l1', source: 'client', target: 'server', label: `${item.name} Link` },
    ],
    phases: ['Initiation & Discovery', 'Negotiation & Challenge', 'Active Exchange', 'Completion'],
    steps,
    exam: {
      id: `exam_${item.id}`,
      protocolId: item.id,
      title: `${item.name} Protocol Challenge`,
      instruction: `Reconstruct the ${item.name} exchange in correct chronological order.`,
      targetNodes: [clientLabel, serverLabel],
      expectedSequence: [
        { from: 'client', to: 'server', packetName: `${item.name} Handshake / Hello`, protocol: item.name },
        { from: 'server', to: 'client', packetName: `${item.name} Response / Challenge`, protocol: item.name },
        { from: 'client', to: 'server', packetName: `${item.name} Data Segment`, protocol: item.name },
        { from: 'server', to: 'client', packetName: `${item.name} Acknowledgment / Close`, protocol: item.name },
      ],
      availablePool: [
        { id: `${item.id}_p1`, from: 'client', to: 'server', packetName: `${item.name} Handshake / Hello`, protocol: item.name },
        { id: `${item.id}_p2`, from: 'server', to: 'client', packetName: `${item.name} Response / Challenge`, protocol: item.name },
        { id: `${item.id}_p3`, from: 'client', to: 'server', packetName: `${item.name} Data Segment`, protocol: item.name },
        { id: `${item.id}_p4`, from: 'server', to: 'client', packetName: `${item.name} Acknowledgment / Close`, protocol: item.name },
        { id: `${item.id}_dist`, from: 'server', to: 'client', packetName: `Spurious ${item.name} RST (Distractor)`, protocol: item.name },
      ],
    },
    isLocked: item.isLocked,
  };
}
