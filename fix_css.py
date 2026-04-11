import re

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has the spaced-out corruption pattern
        # e.g. "p o s i t i o n"
        # We'll look for multiple occurrences of "char space char space"
        # But we must be careful not to remove legitimate spaces.
        # The corruption seems to be EVERY character separated by a space/null/invisible char.
        # Let's inspect a sample first or just try to collapse it.
        
        # It looks like there are extra spaces between every letter.
        # Simple heuristic: If > 40% of chars are spaces, and we see patterns like 'p o s i t i o n', it's likely corrupted.
        
        # Let's try to remove spaces that are between word characters, but keep spaces that are between words?
        # That's hard. 
        # "p o s i t i o n :   r e l a t i v e ;" -> "position: relative;"
        # Maybe the spaces are a specific char?
        
        # Let's just strip ALL spaces and re-format? No, that destroys CSS structure.
        
        # Let's try to detect if it's double-spaced.
        # If we replace "  " with " " and it still looks spaced out?
        
        # Actually, looking at the previous tool output:
        # 7 0 0 :                  p o s i t i o n :    r e l a t i v e ;
        # It seems like there are LOTS of spaces.
        
        # Let's use a smarter regex. 
        # Collapse "char space char" to "charchar"?
        # But "a b" (two vars) vs "a b" (one var 'ab')? In CSS, properties are known.
        
        # Alternative: The corruption might only be in the sections I touched or viewed?
        # "The following code has been modified to include a line number..."
        # The view_file output showed the corruption.
        
        # Let's assume the user's file is corrupted.
        # It is safer to re-write the CSS from scratch if I can, but I don't have the whole content.
        # Wait, I can try to simply remove ALL spaces that are between non-space characters?
        # "p o s" -> "content.replace(' ', '')" ? No, "margin: 10px" -> "margin:10px" (fine).
        # "border: 1px solid red" -> "border:1pxsolidred" (BAD).
        
        # Let's look at the specific pattern: "p o s i t i o n"
        # It is likely that the file was saved with UTF-16 LE/BE opened as UTF-8 or something similar.
        # If so, every other byte is a null byte (which displays as space sometimes or nothing).
        # OR it's literally spaces.
        
        # Let's try to read it effectively.
        # If I remove all spaces, then re-add them? No.
        
        # Let's try to see if it's null bytes.
        with open(filepath, 'rb') as f:
            raw_content = f.read()
        
        # If it has many null bytes
        if raw_content.count(b'\x00') > len(raw_content) / 3:
            print("Detected null bytes, decoding as utf-16")
            try:
                decoded = raw_content.decode('utf-16')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(decoded)
                print("Fixed using utf-16 decode.")
                return
            except:
                pass

        # If it's literally spaces " " (0x20)
        # Maybe I can just use a regex to replace " (.) " with "\1"?
        
        # Let's try a heuristic: Reconstruct the file.
        # Actually, if I look at Step 60:
        # 700:                  p o s i t i o n :    r e l a t i v e ;
        # The indentation is also spaced out.
        
        # It looks like the file was "exploded".
        # Let's try this:
        # Iterate through the file. If we see "char space char space", we remove the spaces.
        # But we need to keep the "real" spaces.
        # Real spaces likely become "  " (double space) or "   " (triple) in this exploded view?
        # "p o s i t i o n :    r e l a t i v e"
        # "position" has single spaces between chars. ":    r" has 4 spaces?
        # If original was "position: relative", we have ": " (colon space).
        # Exploded: ":" " " " " "r" -> ":   r"?
        
        # Let's try to remove every ODD space? No.
        
        # HYPOTHESIS: The file is UTF-16 encoded but saved/viewed as ASCII/UTF-8 with nulls replaced by spaces? 
        # Or I can just try to "fix" it by removing the interleaving spaces.
        
        # Let's try a regex: replace `(?<=\S) (?=\S)` with ``?
        # "p o" -> "po".
        # "position: relative" -> "position:relative".
        # "1px solid" -> "1pxsolid". (Bad).
        
        # Wait, if I look at the previous Step 60 output again:
        # "o b j e c t - f i t :    c o v e r ;"
        # "object-fit" is one word. "cover" is one word.
        # There are 4 spaces between ":" and "c".
        # In standard CSS, it's usually "position: relative;" (1 space).
        # So 1 real space -> 3 or 4 exploded spaces.
        # 0 real spaces -> 1 exploded space.
        
        # So strategy:
        # Replace "   " (3+ spaces) with " " (1 space).
        # Replace " " (1 space) with "" (empty).
        # Then replace "  " (2 spaces)?
        
        # Let's refine:
        # 1. Replace "    " (4 spaces) -> "TEMP_SPACE"
        # 2. Replace "   " (3 spaces) -> "TEMP_SPACE"
        # 3. Replace "  " (2 spaces) -> "TEMP_SPACE" (maybe?)
        # 4. Replace " " (1 space) -> ""
        # 5. Replace "TEMP_SPACE" -> " "
        
        new_lines = []
        for line in content.splitlines():
            # Heuristic clean
            # If line looks exploded
            if re.search(r'\w \w', line):
                # Replace sequences of 2 or more spaces with a placeholder
                line = re.sub(r' {2,}', '___SPACE___', line)
                # Remove single spaces
                line = line.replace(' ', '')
                # Restore placeholders
                line = line.replace('___SPACE___', ' ')
            new_lines.append(line)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print("Fixed by collapsing spaces.")

    except Exception as e:
        print(f"Error: {e}")

clean_file('d:/Codes/portfolio/style.css')
