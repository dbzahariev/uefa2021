import { Button } from "antd";
import React, { useEffect, useState } from "react";
import Picker, { IEmojiData } from "emoji-picker-react";
import { checkMobile } from "./Chat";

export default function EmojiPopup({
  onSelectEmoji,
  disabled = false,
}: {
  onSelectEmoji: Function;
  disabled?: boolean;
}) {
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);

  const onEmojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    emojiObject: IEmojiData
  ) => {
    setShowEmojiPopup(false);

    onSelectEmoji(emojiObject.emoji);
  };

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const updateWindowDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateWindowDimensions);
  }, []);
  return (
    <div style={{ margin: checkMobile() ? 5 : 0 }}>
      <Button
        disabled={disabled || false}
        onClick={() => setShowEmojiPopup(!showEmojiPopup)}
      >
        {"Въвеждане на емотикона"}
      </Button>
      {showEmojiPopup ? (
        <Picker
          pickerStyle={{ width: `${dimensions.width * 0.98}px` }}
          onEmojiClick={onEmojiClick}
        />
      ) : null}
    </div>
  );
}
