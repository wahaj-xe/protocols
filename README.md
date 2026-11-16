# Protocol Explorer · Learn how the internet works

Exact 1:1 replication of [protocol-explorer-alpha.vercel.app](https://protocol-explorer-alpha.vercel.app/) by Dilum Sanjaya.

---

## ⚡ What is included

1. **Complete 39 Protocol Interactive Curriculum**:
   - **Core (11)**: Ethernet, Wi-Fi (WPA2), PPPoE, IP, IPv6, ICMP, IGMP, TCP, UDP, QUIC, BGP
   - **Application (19)**: HTTP, WebSocket, WebRTC, SIP, RTSP, RTMP, DNS, DHCP, NTP, Captive Portal, SMTP, POP3, IMAP, FTP, SMB, HTTP Proxy, SOCKS5, Reverse Proxy, Modbus
   - **Security (9)**: HTTPS, DNS over HTTPS (DoH), DNSSEC, WPA3, RADIUS (802.1X), SSH, TLS/SSL, WireGuard (VPN), IPsec (IKEv2/ESP)

2. **Complete Native Views**:
   - **Network Topology Map**: Animated packets travelling between devices (laptop, home router, ISP, origin servers).
   - **Sequence Diagram View**: Step-by-step lifelines and chronological message flows.
   - **Byte-by-Byte Inspector**: Live decoded bitfields, plain-English explanations, and interactive hex viewer.
   - **Challenge / Exam Mode**: Test understanding by drawing sequence flows and topology links.

3. **Complete Internationalization (20 Languages)**:
   - English, Spanish, Portuguese, French, German, Italian, Dutch, Polish, Turkish, Indonesian, Vietnamese, Greek, Ukrainian, Russian, Chinese (Simplified & Traditional), Japanese, Korean, Hindi, Arabic, and Hebrew.

4. **Features & Controls**:
   - Dark & Light mode toggle with automatic OS preference detection.
   - Quick search modal via `Ctrl+K` / `Cmd+K`.
   - Play/pause timeline scrubber with keyboard shortcuts.

---

## 🚀 How to Run

### Option 1: Quick Launch
Double-click [`start.bat`](start.bat) or run in terminal:
```cmd
start.bat
```
Then open: **[http://localhost:5173/](http://localhost:5173/)**

### Option 2: npm
```bash
npm run dev
```

### Option 3: Production Build
```bash
npm run build
npm run preview
```
