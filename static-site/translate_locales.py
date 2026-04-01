import os
import json
import time
from deep_translator import GoogleTranslator

keys_to_translate = {
    "leaderboard.title": "🏆 Global Top 10",
    "leaderboard.yourScore": "Your Score: {score}",
    "leaderboard.qualified": "🎉 You made the Top 10! Enter your name:",
    "leaderboard.namePlaceholder": "Your name",
    "leaderboard.save": "Save",
    "leaderboard.saving": "...",
    "leaderboard.skip": "Skip",
    "leaderboard.charCount": "{count}/10",
    "leaderboard.loading": "Loading...",
    "leaderboard.error": "Could not load leaderboard",
    "leaderboard.submitError": "Failed to submit score",
    "leaderboard.rateLimited": "Too many attempts. Please try again later.",
    "leaderboard.sessionError": "Game session expired. Please restart the game.",
    "leaderboard.empty": "No scores yet. Be the first!",
    "leaderboard.playAgain": "🔄 Play Again"
}

locale_map = {
    'ar': 'ar', 'as-IN': 'as', 'bn-BD': 'bn', 'de-DE': 'de', 'es-ES': 'es', 'fa-IR': 'fa',
    'fil-PH': 'tl', 'fr-FR': 'fr', 'gu-IN': 'gu', 'ha-NG': 'ha', 'hi-IN': 'hi', 'id-ID': 'id',
    'it-IT': 'it', 'ja-JP': 'ja', 'kk-KZ': 'kk', 'km-KH': 'km', 'kn-IN': 'kn', 'ko-KR': 'ko',
    'lo-LA': 'lo', 'ml-IN': 'ml', 'mr-IN': 'mr', 'ms-MY': 'ms', 'my-MM': 'my', 'ne-NP': 'ne',
    'nl-NL': 'nl', 'or-IN': 'or', 'pa-IN': 'pa', 'pl-PL': 'pl', 'pt-BR': 'pt', 'pt-PT': 'pt',
    'ru-RU': 'ru', 'si-LK': 'si', 'sw-KE': 'sw', 'ta-IN': 'ta', 'te-IN': 'te', 'th-TH': 'th',
    'tr-TR': 'tr', 'uk-UA': 'uk', 'ur-PK': 'ur', 'uz-UZ': 'uz', 'vi-VN': 'vi', 'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW'
}

def translate_text(text, dest):
    if text == "..." or text == "🏆 Global Top 10" and dest in ['ja', 'ko']:
        return text
    
    if text == "🏆 Global Top 10" and dest in ['zh-CN', 'zh-TW']:
        return "🏆 全球前 10" if dest == 'zh-CN' else "🏆 全球前 10"

    temp_text = text.replace("{score}", "S_C_O_R_E").replace("{count}", "C_O_U_N_T")
    
    try:
        translator = GoogleTranslator(source='en', target=dest)
        translated = translator.translate(temp_text)
        result = translated.replace("S_C_O_R_E", "{score}").replace("C_O_U_N_T", "{count}").replace("s_c_o_r_e", "{score}").replace("c_o_u_n_t", "{count}")
        return result
    except Exception as e:
        print(f"Error translating '{text}' to {dest}: {e}")
        return text

def main():
    locales_dir = os.path.join(os.path.dirname(__file__), 'src', 'i18n', 'locales')
    
    for filename in os.listdir(locales_dir):
        if not filename.endswith('.json') or filename == 'en-US.json':
            continue
            
        locale_code = filename.replace('.json', '')
        dest_lang = locale_map.get(locale_code)
        
        if not dest_lang:
            continue
            
        filepath = os.path.join(locales_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        changed = False
        for key, text in keys_to_translate.items():
            if key not in data:
               
                translated = translate_text(text, dest_lang)
                data[key] = translated
                changed = True
                time.sleep(0.1) # Small delay to be safe
                
        if changed:
            print(f"Finished {locale_code}")
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write("\n")

if __name__ == "__main__":
    main()
