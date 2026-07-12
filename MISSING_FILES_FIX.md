### 🛠️ How to migrate/restore old notes if they don't show up in the app

If you manually moved your old note files into the `~/.config/codex/notes/` folder but Codex isn't showing them, **don't panic, your data is safe.** This happens because Codex uses an internal database/registry to keep track of notes. If you just drop a file into the folder, the app won't recognize it because it's not registered in the database. 

To fix this, we can do a quick "file transplant" using the terminal. Here is the step-by-step workaround:

#### Step 1: Register a new note in the app
1. Open the new version of Codex.
2. Create a **New Note** (you can name it something like *"Recovered Note"*).
3. Close the app completely. This forces Codex to register the new note in its database.

#### Step 2: Find the internal file name
1. Open your terminal.
2. Run the following command to find the newly created file (it will be at the top of the list and will have a random string name):
```bash
ls -lt ~/.config/codex/notes/ | head -n 5
```
3. Copy that random filename.

#### Step 3: Overwrite the file
Now, we will overwrite the empty registered note with your old note data. 
Run the `cp` (copy) command in your terminal like this:

```bash
cp /path/to/your/OLD_NOTE_FILE ~/.config/codex/notes/THE_NEW_RANDOM_NAME
```
*(Make sure to replace `/path/to/your/OLD_NOTE_FILE` with the actual path of your old file, and `THE_NEW_RANDOM_NAME` with the file name you found in Step 2).*

#### Step 4: You're done!
Open Codex again. Click on the *"Recovered Note"* you created in Step 1, and you will see all your old content perfectly restored! 

> **Note on Custom Styles:** If you are upgrading to the new version containing the `CustomStyle` extension, you don't need to worry about formatting crashes. The extension is built with backward compatibility (`default: null`), so it will automatically read and safely upgrade your old files without any errors.
