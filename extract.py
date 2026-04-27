import os

def write_file(path, lines, start, end):
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)
    with open(path, "w") as f:
        # fix typo in line 6285
        content = lines[start-1:end]
        if path == "src/components/AIChatbot.tsx" and content[0].startswith("mport"):
            content[0] = "i" + content[0]
        f.writelines(content)

def main():
    with open("README.md", "r") as f:
        lines = f.readlines()

    write_file(".env", lines, 1, 10)
    write_file(".gitignore", lines, 11, 18)
    write_file("index.html", lines, 19, 30)
    write_file("app.json", lines, 32, 37)
    write_file("package-lock.json", lines, 38, 5949)
    write_file("package.json", lines, 5950, 5985)
    write_file("src/App.tsx", lines, 5986, 6284)
    write_file("src/components/AIChatbot.tsx", lines, 6285, 6437)
    write_file("src/components/Background3D.tsx", lines, 6438, 6493)
    write_file("src/components/CandidateSimulation.tsx", lines, 6494, 6794)
    write_file("src/components/ElectionData.tsx", lines, 6795, 6873)
    write_file("src/components/ElectionDayCompanion.tsx", lines, 6874, 7064)
    write_file("src/components/FutureYouSimulator.tsx", lines, 7065, 7262)
    write_file("src/components/MiniGamesPack.tsx", lines, 7263, 7537)
    write_file("src/components/NodesBackground.tsx", lines, 7538, 7590)
    write_file("src/components/PoliticalDNA.tsx", lines, 7591, 7839)
    write_file("src/components/SwipeVoterGame.tsx", lines, 7840, 8068)
    write_file("src/components/VoteImpactCalculator.tsx", lines, 8069, 8288)
    write_file("src/index.css", lines, 8289, 8330)
    write_file("src/main.tsx", lines, 8331, 8340)
    write_file("src/lib/gemini.ts", lines, 8341, 8373)
    write_file("tsconfig.json", lines, 8374, 8399)
    write_file("vite.config.ts", lines, 8400, 8424)

    # Let's also restore the README to just a basic markdown file.
    with open("README.md", "w") as f:
        f.write("# PromptWarsCohort2\n\nThis project was successfully extracted into its component files.\n")

    print("Extraction complete.")

if __name__ == "__main__":
    main()
