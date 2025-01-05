import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export interface ShareUrl {
  url: string;
  onCancel: () => void; 
}

const ShareOverlay: React.FC<ShareUrl> = ({ url, onCancel }) => {
  const [isCopied, setIsCopied] = useState(false);


  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); 
    });
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target instanceof Element && !target.closest('.overlayShare')) {
        onCancel(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return (
    <div className="overlayShare">
      <h3>Share this event</h3>
      
      <div className="iconsContainer">
        <FacebookShareButton url={url}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={url}>
          <XIcon size={40} round />
        </TwitterShareButton>

        <WhatsappShareButton url={url}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <LinkedinShareButton url={url}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>

        <EmailShareButton url={url}>
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>

      <div className="copyContainer">
        <input
          type="text"
          value={url}
          readOnly
          className="copyInput"
        />
        <button onClick={handleCopy} className="copyButton">
          {isCopied ? "Copied!" : <ContentCopyIcon fontSize="small"/>}
        </button>
      </div>
    </div>
  );
};

export default ShareOverlay;
