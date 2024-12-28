import { UrlParser } from "./UrlParser";
import ICampaignInfo from "./intefaces/ICampaignInfo";

function readTokenString(tokenString ?: string, fileType ?: string): CampaignInfo {
	const base64Url = tokenString.split(".")[1];
	const base64 =  base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const campaignInfo = JSON.parse(window.atob(base64)).payload as ICampaignInfo;

	if (fileType === "attachment") {
		campaignInfo.download_type = "attachment";
	} else if (fileType !== null) {
		campaignInfo.download_type = "file";
	}

	return campaignInfo;
}

export function findCampaignInfo() : [string, ICampaignInfo] {
	const url = new UrlParser(window.location.href);
	const tokenString = url.findParam("tk");
	if (!tokenString) {
		throw new Error("Missing ATTACK Simulator token");
	}
	const fileType = url.findParam("file_type");

	try {
		return [tokenString, readTokenString(tokenString, fileType)];
	} catch(e) {
		return [tokenString, { ats_company_id: "" }];
	}
}
