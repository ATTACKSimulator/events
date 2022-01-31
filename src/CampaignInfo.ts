import { UrlParser } from "./UrlParser";

export interface CampaignInfo {
    ats_env ?: string
    ats_atk_type ?: string
    ats_campaign_name ?: string
    ats_company_id ?: string
    ats_instance_id ?: string
    ats_locale ?: string
    ats_processed_date ?: string
    ats_user_id ?: string
	download_type ?: string
}

function readTokenString(tokenString ?: string, fileType ?: string): CampaignInfo {
	const base64Url = tokenString.split(".")[1];
	const base64 =  base64Url.replace(/-/g, "+").replace(/_/g, "/");
	const campaignInfo = JSON.parse(window.atob(base64)).payload as CampaignInfo;

	if (fileType === "attachment") {
		campaignInfo.download_type = "attachment";
	} else if (fileType !== null) {
		campaignInfo.download_type = "file";
	}

	return campaignInfo;
}

export function findCampaignInfo() : [string, CampaignInfo] {
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