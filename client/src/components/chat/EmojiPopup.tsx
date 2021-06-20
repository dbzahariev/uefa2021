import { Button } from "antd";
import React, { useState } from "react";
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
  return (
    <div style={{ margin: checkMobile() ? 5 : 0 }}>
      <Button
        disabled={disabled || false}
        onClick={() => setShowEmojiPopup(!showEmojiPopup)}
      >
        emoji
      </Button>
      {showEmojiPopup ? (
        <div>
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      ) : null}
    </div>
  );
}
