import { IAuth } from "@/types";

export function getProviderLabel(auths: IAuth[]) {
    const providers = auths.map((a) => a.provider);
    if (providers.includes("google") && providers.includes("local"))
        return "Google + Password";
    if (providers.includes("google")) return "Google";
    return "Email & Password";
}