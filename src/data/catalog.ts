import type { CatalogItem } from '../types/protocol';

export const PROTOCOL_CATALOG: CatalogItem[] = [
  // 1. HTTP
  { id: 'http', name: 'HTTP', full: 'Hypertext Transfer Protocol', group: 'application', standard: 'RFC 9112', isLocked: false },
  // 2. HTTPS
  { id: 'https', name: 'HTTPS', full: 'HTTP Secure', group: 'security', standard: 'RFC 8446', isLocked: false },
  // 3. WebSocket
  { id: 'websocket', name: 'WebSocket', full: 'Two-way web messaging', group: 'application', standard: 'RFC 6455', isLocked: false },
  // 4. WebRTC
  { id: 'webrtc', name: 'WebRTC', full: 'Browser video calls', group: 'application', standard: 'RFC 8829', isLocked: true },
  // 5. SIP
  { id: 'sip', name: 'SIP', full: 'Internet phone calls', group: 'application', standard: 'RFC 3261', isLocked: true },
  // 6. RTSP
  { id: 'rtsp', name: 'RTSP', full: 'IP camera streams', group: 'application', standard: 'RFC 7826', isLocked: true },
  // 7. RTMP
  { id: 'rtmp', name: 'RTMP', full: 'Live streaming upload', group: 'application', standard: 'Adobe RTMP Spec', isLocked: true },
  // 8. QUIC
  { id: 'quic', name: 'QUIC', full: 'HTTP/3 over UDP', group: 'core', standard: 'RFC 9000', isLocked: false },
  // 9. TCP
  { id: 'tcp', name: 'TCP', full: 'Transmission Control Protocol', group: 'core', standard: 'RFC 793', isLocked: false },
  // 10. UDP
  { id: 'udp', name: 'UDP', full: 'User Datagram Protocol', group: 'core', standard: 'RFC 768', isLocked: false },
  // 11. IP
  { id: 'ip', name: 'IP', full: 'Internet Protocol', group: 'core', standard: 'RFC 791', isLocked: false },
  // 12. BGP
  { id: 'bgp', name: 'BGP', full: 'Routing between networks', group: 'core', standard: 'RFC 4271', isLocked: true },
  // 13. IPv6
  { id: 'ipv6', name: 'IPv6', full: 'Address setup, neighbour discovery', group: 'core', standard: 'RFC 8200', isLocked: true },
  // 14. DNS
  { id: 'dns', name: 'DNS', full: 'Domain Name System', group: 'application', standard: 'RFC 1035', isLocked: false },
  // 15. DoH
  { id: 'doh', name: 'DNS over HTTPS', full: 'Private DNS lookups', group: 'security', standard: 'RFC 8484', isLocked: true },
  // 16. DNSSEC
  { id: 'dnssec', name: 'DNSSEC', full: 'Signed DNS answers', group: 'security', standard: 'RFC 4033', isLocked: true },
  // 17. DHCP
  { id: 'dhcp', name: 'DHCP', full: 'Dynamic Host Configuration', group: 'application', standard: 'RFC 2131', isLocked: false },
  // 18. ICMP
  { id: 'icmp', name: 'ICMP', full: 'Internet Control Message', group: 'core', standard: 'RFC 792', isLocked: false },
  // 19. IGMP
  { id: 'igmp', name: 'IGMP', full: 'Multicast and TV channels', group: 'core', standard: 'RFC 3376', isLocked: true },
  // 20. NTP
  { id: 'ntp', name: 'NTP', full: 'Network Time Protocol', group: 'application', standard: 'RFC 5905', isLocked: true },
  // 21. Ethernet
  { id: 'ethernet', name: 'Ethernet', full: 'Frames and switches', group: 'core', standard: 'IEEE 802.3', isLocked: false },
  // 22. PPPoE
  { id: 'pppoe', name: 'PPPoE', full: 'Broadband logins', group: 'core', standard: 'RFC 2516', isLocked: true },
  // 23. Wi-Fi
  { id: 'wifi', name: 'Wi-Fi', full: 'Joining a network (WPA2)', group: 'core', standard: 'IEEE 802.11i', isLocked: true },
  // 24. WPA3
  { id: 'wpa3', name: 'WPA3', full: 'Wi-Fi Protected Access 3', group: 'security', standard: 'IEEE 802.11az (SAE)', isLocked: true },
  // 25. RADIUS
  { id: 'radius', name: 'RADIUS', full: '802.1X Enterprise Wi-Fi', group: 'security', standard: 'RFC 2865', isLocked: true },
  // 26. Captive Portal
  { id: 'portal', name: 'Captive Portal', full: 'Hotel and café Wi-Fi logins', group: 'application', standard: 'RFC 8952', isLocked: true },
  // 27. SMTP
  { id: 'smtp', name: 'SMTP', full: 'Simple Mail Transfer Protocol', group: 'application', standard: 'RFC 5321', isLocked: true },
  // 28. POP3
  { id: 'pop3', name: 'POP3', full: 'Post Office Protocol v3', group: 'application', standard: 'RFC 1939', isLocked: true },
  // 29. IMAP
  { id: 'imap', name: 'IMAP', full: 'Internet Message Access', group: 'application', standard: 'RFC 3501', isLocked: true },
  // 30. FTP
  { id: 'ftp', name: 'FTP', full: 'File Transfer Protocol', group: 'application', standard: 'RFC 959', isLocked: true },
  // 31. SMB
  { id: 'smb', name: 'SMB', full: 'Windows file sharing', group: 'application', standard: 'MS-SMB2', isLocked: true },
  // 32. SSH
  { id: 'ssh', name: 'SSH', full: 'Secure Shell', group: 'security', standard: 'RFC 4253', isLocked: true },
  // 33. TLS/SSL
  { id: 'tls', name: 'TLS/SSL', full: 'Transport Layer Security', group: 'security', standard: 'RFC 8446', isLocked: true },
  // 34. HTTP Proxy
  { id: 'proxy', name: 'HTTP Proxy', full: 'Forward proxy and CONNECT', group: 'application', standard: 'RFC 9110 §9.3.6', isLocked: true },
  // 35. SOCKS5
  { id: 'socks', name: 'SOCKS5', full: 'Socket Secure proxy', group: 'application', standard: 'RFC 1928', isLocked: true },
  // 36. Reverse Proxy
  { id: 'reverse', name: 'Reverse Proxy', full: 'TLS offloading', group: 'application', standard: 'Reverse Proxy Arch', isLocked: true },
  // 37. WireGuard
  { id: 'wireguard', name: 'WireGuard', full: 'A modern VPN', group: 'security', standard: 'WireGuard Whitepaper', isLocked: true },
  // 38. IPsec
  { id: 'ipsec', name: 'IPsec', full: 'IKEv2 and ESP', group: 'security', standard: 'RFC 7296', isLocked: true },
  // 39. Modbus
  { id: 'modbus', name: 'Modbus', full: 'Industrial control (OT)', group: 'application', standard: 'Modbus TCP/IP', isLocked: true },
];

export const GROUP_COUNTS = {
  all: PROTOCOL_CATALOG.length,
  core: PROTOCOL_CATALOG.filter((p) => p.group === 'core').length,
  application: PROTOCOL_CATALOG.filter((p) => p.group === 'application').length,
  security: PROTOCOL_CATALOG.filter((p) => p.group === 'security').length,
};
