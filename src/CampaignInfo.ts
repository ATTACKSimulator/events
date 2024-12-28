import { UrlParser } from "./UrlParser";
import ICampaignInfo from "./intefaces/ICampaignInfo";

/**
 * Reads and decodes a token string to extract campaign information.
 *
 * @param {string} [tokenString] - The token string to be decoded.
 * @param {string} [fileType] - The type of file associated with the campaign.
 * @returns {ICampaignInfo} - The decoded campaign information.
 */
function readTokenString(tokenString ?: string, fileType ?: string): ICampaignInfo {
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

/**
 * Finds and returns the campaign information from the URL.
 *
 * @returns {[string, ICampaignInfo]} - A tuple containing the token string and the decoded campaign information.
 * @throws {Error} - Throws an error if the ATTACK Simulator token is missing.
 */
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
