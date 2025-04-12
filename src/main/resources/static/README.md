# HabbitUp - Aplikacja do śledzenia nawyków

HabbitUp to aplikacja webowa pomagająca w budowaniu lepszych nawyków i rozwijaniu potencjału osobistego dzięki spersonalizowanym analizom opartym na AI.

## Struktura projektu

```
src/main/resources/static/
├── css/                      # Wspólne style CSS (źródłowe)
├── js/                       # Wspólne skrypty JS (źródłowe)
├── images/                   # Wspólne obrazy i zasoby graficzne
├── index/                    # Strona główna (landing page)
│   ├── css/                  # Pliki CSS specyficzne dla strony głównej
│   ├── js/                   # Pliki JavaScript dla strony głównej
│   └── index.html            # Strona główna aplikacji
├── main/                     # Główny panel aplikacji po zalogowaniu
│   ├── css/                  # Pliki CSS specyficzne dla panelu głównego
│   ├── js/                   # Pliki JavaScript dla panelu głównego
│   └── main.html             # Panel główny aplikacji
└── README.md                 # Ten plik
```

## Organizacja kodu

Projekt HabbitUp jest zorganizowany według zasady "separation of concerns" (oddzielenie odpowiedzialności). Każda strona (index, main) ma swój dedykowany folder zawierający wszystkie zasoby potrzebne do jej działania:

- **HTML**: Struktura strony
- **CSS**: Style specyficzne dla danej strony
- **JavaScript**: Logika biznesowa specyficzna dla danej strony

Wspólne zasoby, takie jak obrazy, ikony i podstawowe komponenty, są umieszczone w folderach głównych, aby uniknąć duplikacji.

## Konwencje nazewnictwa

- **Pliki CSS**: Używamy podejścia BEM (Block, Element, Modifier) do nazewnictwa klas
- **Pliki JavaScript**: Używamy camelCase dla zmiennych i funkcji, PascalCase dla klas
- **Pliki HTML**: Używamy semantycznych tagów HTML5
- **Nazwy plików**: Używamy małych liter i myślników jako separatorów

## Dokumentacja

Każdy folder zawiera własny plik README.md z dodatkową dokumentacją specyficzną dla danego komponentu aplikacji.

## Rozwój aplikacji

### Wymagania

- Java 17+
- Spring Boot 3.x
- Node.js 18+ (dla narzędzi deweloperskich)

### Uruchomienie projektu

```bash
# Klonowanie repozytorium
git clone https://github.com/twojuser/habbitup.git
cd habbitup

# Uruchomienie aplikacji
./mvnw spring-boot:run
```

Aplikacja będzie dostępna pod adresem http://localhost:8080

## Najlepsze praktyki

1. **Modularność**: Każdy moduł powinien być niezależny i możliwy do ponownego użycia
2. **Dokumentacja**: Wszystkie funkcje i komponenty powinny być dobrze udokumentowane
3. **Testowanie**: Kod powinien być testowalny i dobrze przetestowany
4. **Responsywność**: Design powinien być w pełni responsywny i obsługiwać urządzenia mobilne
5. **Dostępność**: Aplikacja powinna być dostępna dla osób z niepełnosprawnościami

---

© 2023 HabbitUp. Wszelkie prawa zastrzeżone. 