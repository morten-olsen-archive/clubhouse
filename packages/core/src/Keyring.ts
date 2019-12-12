import * as openpgp from 'openpgp';

export interface PublicIdentity {
  key: openpgp.key.Key;
  publicKey: string;
  fingerprint: string;
  id: string;
}

class Keyring {
  private identities: PublicIdentity[] = [];

  addKeys = async (publicKeys: string[]) => {
    const identities = await Promise.all(
      publicKeys.map<Promise<PublicIdentity>>(async (publicKey) => {
        const allKeys = await openpgp.key.readArmored(publicKey);
        const [key] = allKeys.keys;
        return {
          key,
          publicKey,
          fingerprint: key.getFingerprint(),
          id: (key.getKeyId() as any).bytes,
        };
      }),
    );
    this.identities.push(...identities);
  }

  toPublicKeys = (): string[] => this.identities.map((i) => i.publicKey)
}

export default Keyring;
