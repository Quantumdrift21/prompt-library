import re
import json
import os

def parse_markdown_to_json(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by <details> blocks
    # Updated regex to be more robust for titles and content blocks
    prompt_blocks = re.findall(r'<details>\s*<summary>\s*<strong>(.*?)</strong>\s*</summary>\s*(.*?)\s*</details>', content, re.DOTALL)

    prompts = []
    
    for title, body in prompt_blocks:
        # Extract content from ```md ... ``` code blocks
        # We look for the code block content specifically
        code_match = re.search(r'```md\s*(.*?)\s*```', body, re.DOTALL)
        
        prompt_content = ""
        if code_match:
            prompt_content = code_match.group(1).strip()
        else:
            # Fallback if no code block is found, take the whole body text
            # Cleaning up "## Title" if present in body
            clean_body = re.sub(r'##\s+.*?\n', '', body).strip()
            # Also clean "Contributed by..." lines
            clean_body = re.sub(r'Contributed by\s+\[.*?\]\(.*?\)', '', clean_body).strip()
            prompt_content = clean_body

        # Infer tags from the title or hardcode a generic 'imported' tag
        # Since the input format doesn't have explicit tags, we'll generate some basic ones
        tags = ["imported"]
        if "Developer" in title:
            tags.append("coding")
        if "Linux" in title:
            tags.append("technical")
        
        prompts.append({
            "title": title.strip(),
            "content": prompt_content,
            "tags": tags
        })

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(prompts, f, indent=4)

    print(f"Successfully converted {len(prompts)} prompts to {output_file}")


if __name__ == "__main__":
    # Create a sample input file if it doesn't exist for testing
    sample_input = "prompts_to_import.md"
    if not os.path.exists(sample_input):
        with open(sample_input, "w", encoding="utf-8") as f:
            f.write("""
<details>
<summary><strong>Ethereum Developer</strong></summary>

## Ethereum Developer

Contributed by [@ameya-2003](https://github.com/ameya-2003)

```md
Imagine you are an experienced Ethereum developer tasked with creating a smart contract for a blockchain messenger. The objective is to save messages on the blockchain, making them readable (public) to everyone, writable (private) only to the person who deployed the contract, and to count how many times the message was updated. Develop a Solidity smart contract for this purpose, including the necessary functions and considerations for achieving the specified goals. Please provide the code and any relevant explanations to ensure a clear understanding of the implementation.
```

</details>
""")
        print(f"Created sample input file: {sample_input}")

    # Run the conversion
    parse_markdown_to_json(sample_input, "prompts_import.json")
