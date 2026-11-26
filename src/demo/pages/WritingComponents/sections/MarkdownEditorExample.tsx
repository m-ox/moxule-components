import { useState } from "react";
import { MarkdownEditor, useNudges } from "../../../../index";

export const blogMarkdownStorageKey = "moxule-components.blog.markdown";
const initialMarkdown = "# A little story\n\nEvery good post starts with an idea. Make this one **yours**.\n\n## A few things to try\n\n- Format a word with the toolbar\n- Preview your post\n- Save it or download the Markdown file\n";

function loadMarkdown() {
  try {
    return window.localStorage.getItem(blogMarkdownStorageKey) ?? initialMarkdown;
  } catch {
    return initialMarkdown;
  }
}

export function MarkdownEditorExample() {
  const [markdown, setMarkdown] = useState(loadMarkdown);
  const { nudge } = useNudges();
  return (
        <MarkdownEditor
          label="Post content"
          description="Save keeps this example in your browser. Download gives you a Markdown file."
          name="postContent"
          value={markdown}
          onChange={setMarkdown}
          downloadFileName="my-blog-post.md"
          onSave={(content) => {
            window.localStorage.setItem(blogMarkdownStorageKey, content);
            nudge({ variant: "success", message: "Your Markdown post has been saved in this browser." });
          }}
        />
  );
}
