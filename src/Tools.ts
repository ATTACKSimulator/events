export function createUUID() {
	// http://www.ietf.org/rfc/rfc4122.txt
	const s: any[] = [];
	const hexDigits = "0123456789abcdef";
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	return s.join("");
}

const firstTLDs = "ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|be|bf|bg|bh|bi|bj|bm|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|cl|cm|cn|co|cr|cu|cv|cw|cx|cz|de|dj|dk|dm|do|dz|ec|ee|eg|es|et|eu|fi|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jo|jp|kg|ki|km|kn|kp|kr|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|na|nc|ne|nf|ng|nl|no|nr|nu|nz|om|pa|pe|pf|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|yt".split("|");

const secondTLDs = "com|edu|gov|net|mil|org|nom|sch|caa|res|off|gob|int|tur|ip6|uri|urn|asn|act|nsw|qld|tas|vic|pro|biz|adm|adv|agr|arq|art|ato|bio|bmd|cim|cng|cnt|ecn|eco|emp|eng|esp|etc|eti|far|fnd|fot|fst|g12|ggf|imb|ind|inf|jor|jus|leg|lel|mat|med|mus|not|ntr|odo|ppg|psc|psi|qsl|rec|slg|srv|teo|tmp|trd|vet|zlg|web|ltd|sld|pol|fin|k12|lib|pri|aip|fie|eun|sci|prd|cci|pvt|mod|idv|rel|sex|gen|nic|abr|bas|cal|cam|emr|fvg|laz|lig|lom|mar|mol|pmn|pug|sar|sic|taa|tos|umb|vao|vda|ven|mie|北海道|和歌山|神奈川|鹿児島|ass|rep|tra|per|ngo|soc|grp|plc|its|air|and|bus|can|ddr|jfk|mad|nrw|nyc|ski|spy|tcm|ulm|usa|war|fhs|vgs|dep|eid|fet|fla|flå|gol|hof|hol|sel|vik|cri|iwi|ing|abo|fam|gok|gon|gop|gos|aid|atm|gsm|sos|elk|waw|est|aca|bar|cpa|jur|law|sec|plo|www|bir|cbg|jar|khv|msk|nov|nsk|ptz|rnd|spb|stv|tom|tsk|udm|vrn|cmw|kms|nkz|snz|pub|fhv|red|ens|nat|rns|rnu|bbs|tel|bel|kep|nhs|dni|fed|isa|nsn|gub|e12|tec|орг|обр|упр|alt|nis|jpn|mex|ath|iki|nid|gda|inc".split("|");

const knownSubdomains = "www|studio|mail|remote|blog|webmail|server|ns1|ns2|smtp|secure|vpn|m|shop|ftp|mail2|test|portal|ns|ww1|host|support|dev|web|bbs|ww42|squatter|mx|email|1|mail1|2|forum|owa|www2|gw|admin|store|mx1|cdn|api|exchange|app|gov|2tty|vps|govyty|hgfgdf|news|1rer|lkjkui";

/**
 * Removes the subdomain from the given string, if it matches any known subdomains.
 *
 * @param {string} s - The string from which to remove the subdomain.
 * @returns {string} - The string without the subdomain.
 */
export function removeSubdomain(s: string): string {
	const knownSubdomainsRegExp = new RegExp(`^(${knownSubdomains}).`, "i");
	s = s.replace(knownSubdomainsRegExp, "");

	const parts = s.split(".");

	while (parts.length > 3) {
		parts.shift();
	}

	if (parts.length === 3 && ((parts[1].length > 2 && parts[2].length > 2) || (secondTLDs.indexOf(parts[1]) === -1) && firstTLDs.indexOf(parts[2]) === -1)) {
		parts.shift();
	}

	return parts.join(".");
}

const timeouts = {};
/**
 * Debounce a function, ensuring it is only called after a specified wait time has elapsed since the last call.
 *
 * @template Args - The type of arguments the callback function accepts.
 * @param {(...args: Args) => void} callback - The function to debounce.
 * @param {number} wait - The number of milliseconds to wait before invoking the callback.
 * @param {...Args} args - The arguments to pass to the callback function.
 */
export function debounce<Args extends any[]>(callback: (...args: Args) => void, wait: number, ...args: Args) : void {
	const [, event] = args;
	
	if (! event.target.hasAttribute("data-id")) {
		event.target.setAttribute("data-id", createUUID());
	}

	const id = event.target.getAttribute("data-id");

	if (timeouts[id]) {
		clearTimeout(timeouts[id]);
	}

	timeouts[id] = setTimeout(callback, wait, ...args);
}