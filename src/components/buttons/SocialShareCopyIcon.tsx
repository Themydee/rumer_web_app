import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { HiOutlineClipboard } from "react-icons/hi2";
import { HiOutlineClipboardCheck } from "react-icons/hi";

interface SocialShareCopyIconProps {
	shareUrl: string;
	onCopy: () => void;
	isCopied: boolean;
}

const SocialShareCopyIcon = ({
	shareUrl,
	onCopy,
	isCopied,
}: SocialShareCopyIconProps) => {
	return (
		// @ts-ignore
		<CopyToClipboard text={shareUrl} onCopy={onCopy}>
			<button
				className='rounded-xl w-9 h-9 lg:w-12 lg:h-12 hover:scale-110 flex flex-col items-center justify-center border border-white/40 transition-[.4]'
				title='Copy Link'
			>
				{isCopied ? (
					<HiOutlineClipboardCheck className='text-white/80 text-xl lg:text-2xl' />
				) : (
					<HiOutlineClipboard className='text-white/80 text-xl lg:text-2xl' />
				)}
				{isCopied ? (
					<div className='share-count text-green-600 text-[8px]'>Copied!</div>
				) : (
					<div className='share-count text-green-600 text-[8px]'>Copy</div>
				)}
			</button>
		</CopyToClipboard>
	);
};

export default SocialShareCopyIcon;
