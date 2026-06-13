export interface SubnetResult {
  ip: string;
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  usableHostRange: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalUsableHosts: number;
  ipClass: string;
  ipType: {
    type: string;
    description: string;
    badgeColor: string;
  };
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
}

export function ipToLong(ip: string): number {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return 0;
  return (parts[0] * 16777216 + parts[1] * 65536 + parts[2] * 256 + parts[3]) >>> 0;
}

export function longToIp(long: number): string {
  const o1 = Math.floor(long / 16777216) % 256;
  const o2 = Math.floor(long / 65536) % 256;
  const o3 = Math.floor(long / 256) % 256;
  const o4 = long % 256;
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    if (part === '') return false;
    const num = parseInt(part, 10);
    if (isNaN(num) || num < 0 || num > 255) return false;
    // Disallow leading zeros for non-zero numbers to prevent octal confusion
    if (part.length > 1 && part[0] === '0') return false;
    // Check for non-numeric characters
    if (!/^\d+$/.test(part)) return false;
    return true;
  });
}

export function getMaskLong(prefix: number): number {
  if (prefix === 0) return 0;
  if (prefix === 32) return 0xffffffff;
  return (~((1 << (32 - prefix)) - 1)) >>> 0;
}

export function getIpClass(firstOctet: number): string {
  if (firstOctet >= 0 && firstOctet <= 127) return 'Class A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
  return 'Class E (Experimental)';
}

export function getIpType(longIp: number, firstOctet: number): { type: string; description: string; badgeColor: string } {
  // Octets lookup
  // Private networks RFC 1918
  // 10.0.0.0 - 10.255.255.255
  // 172.16.0.0 - 172.31.255.255
  // 192.168.0.0 - 192.168.255.255
  if (firstOctet === 10) {
    return { type: 'Private', description: 'RFC 1918 Private Address', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }
  
  const secondOctet = Math.floor(longIp / 65536) % 256;
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) {
    return { type: 'Private', description: 'RFC 1918 Private Address', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }
  
  if (firstOctet === 192 && secondOctet === 168) {
    return { type: 'Private', description: 'RFC 1918 Private Address', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  }

  // Loopback 127.0.0.0/8
  if (firstOctet === 127) {
    return { type: 'Loopback', description: 'Localhost loopback address', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
  }

  // Link-Local (APIPA) 169.254.0.0/16
  if (firstOctet === 169 && secondOctet === 254) {
    return { type: 'Link-Local', description: 'Auto-configuration APIPA', badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
  }

  // Carrier-Grade NAT RFC 6598: 100.64.0.0/10
  if (firstOctet === 100 && (secondOctet & 0xc0) === 64) {
    return { type: 'Shared', description: 'Carrier-Grade NAT Address', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
  }

  // Multicast 224.0.0.0/4
  if (firstOctet >= 224 && firstOctet <= 239) {
    return { type: 'Multicast', description: 'Class D Multicast group', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
  }

  // Experimental/Reserved 240.0.0.0/4
  if (firstOctet >= 240) {
    return { type: 'Reserved', description: 'Class E Reserved/Experimental', badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };
  }

  // Documentations: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24
  if (
    (firstOctet === 192 && secondOctet === 0 && (Math.floor(longIp / 256) % 256) === 2) ||
    (firstOctet === 198 && secondOctet === 51 && (Math.floor(longIp / 256) % 256) === 100) ||
    (firstOctet === 203 && secondOctet === 0 && (Math.floor(longIp / 256) % 256) === 113)
  ) {
    return { type: 'Documentation', description: 'Reserved for examples/docs', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  }

  return { type: 'Public', description: 'Globally routable Internet address', badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
}

export function toBinaryString(long: number): string {
  const o1 = ((long >>> 24) & 256 - 1).toString(2).padStart(8, '0');
  const o2 = ((long >>> 16) & 256 - 1).toString(2).padStart(8, '0');
  const o3 = ((long >>> 8) & 256 - 1).toString(2).padStart(8, '0');
  const o4 = (long & 256 - 1).toString(2).padStart(8, '0');
  return `${o1}.${o2}.${o3}.${o4}`;
}

export function calculateSubnet(ip: string, prefix: number): SubnetResult {
  const ipLong = ipToLong(ip);
  const firstOctet = parseInt(ip.split('.')[0], 10) || 0;
  
  const maskLong = getMaskLong(prefix);
  const wildcardLong = ~maskLong >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  let firstUsableLong = 0;
  let lastUsableLong = 0;
  let totalUsableHosts = 0;
  let usableHostRange = '';

  if (prefix === 32) {
    firstUsableLong = ipLong;
    lastUsableLong = ipLong;
    totalUsableHosts = 1;
    usableHostRange = `${longToIp(ipLong)} (Host Only)`;
  } else if (prefix === 31) {
    firstUsableLong = networkLong;
    lastUsableLong = broadcastLong;
    totalUsableHosts = 2;
    usableHostRange = `${longToIp(firstUsableLong)} - ${longToIp(lastUsableLong)}`;
  } else {
    firstUsableLong = (networkLong + 1) >>> 0;
    lastUsableLong = (broadcastLong - 1) >>> 0;
    totalUsableHosts = (broadcastLong - networkLong - 1) >>> 0;
    usableHostRange = `${longToIp(firstUsableLong)} - ${longToIp(lastUsableLong)}`;
  }

  const subnetMask = longToIp(maskLong);
  const wildcardMask = longToIp(wildcardLong);
  const networkAddress = longToIp(networkLong);
  const broadcastAddress = longToIp(broadcastLong);

  return {
    ip,
    prefix,
    subnetMask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    usableHostRange,
    firstUsableIp: longToIp(firstUsableLong),
    lastUsableIp: longToIp(lastUsableLong),
    totalUsableHosts,
    ipClass: getIpClass(firstOctet),
    ipType: getIpType(ipLong, firstOctet),
    binaryIp: toBinaryString(ipLong),
    binaryMask: toBinaryString(maskLong),
    binaryNetwork: toBinaryString(networkLong),
    binaryBroadcast: toBinaryString(broadcastLong)
  };
}
