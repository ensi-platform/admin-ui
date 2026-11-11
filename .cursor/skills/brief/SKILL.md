---
name: brief
description: >-
    Interview the user and write brief/<slug>.md from their words and file
    citations. Run as /brief <request>.
disable-model-invocation: true
---

# Feature brief

Write `brief/<slug>.md` at the package root, in Russian, and stop when the brief is closed. Implementation is a separate request. Take the slug from the primitive directory when lookup finds one: `src/password/` becomes `brief/password.md`. Otherwise take the slug from the user's name for the feature, in kebab case.

The text after `/brief` is the request or a pasted specification. A closed cell is the user's sentence, or a path plus the fact that file states. A behavior neither the user nor a file states stays a hole. The brief records what the user decided, so every answer comes from the user.

Treat a pasted specification as nuances. A nuance is one concrete value, label, exception, or constraint in the user's words. Copy a nuance only into the slot it answers. The slot template below is the brief's skeleton, and the specification's headings and order stay out of the file.

## Slots

```md
# <название словами пользователя>

## Что это

## Кто и зачем

## Где используется

## Данные и правила

## Успешный путь

## Ошибки

## Тексты

## Критерии приёмки

## Что не входит

## Дыры
```

When the feature is an input control, add these headings after `## Ошибки`: `## Пустое`, `## Недоступно`, `## Только чтение`, `## Действия`.

`## Что не входит` and every other slot close the same way: the user's sentence, a citation, «не ограничивал», or «решу позже». «Решу позже» keeps the slot under `## Дыры`, marked as postponed. `## Дыры` lists every heading above that has no quote and no citation.

## Steps

1. **Read the request.** An empty request gets one question in the reply: which feature. A pasted specification is split into nuances, each one detail in the user's words, and the list goes into the reply.
   **Done when:** the request names a feature, and the nuance list is in the reply or the request has no pasted specification.

2. **Lookup.** Search `src/` for a primitive the request names. Read its `types.ts`, `docs/Description.ru.md`, and `docs/Description.en.md` when those files exist. Those files outrank this skill: a fact they state closes the slot by citation. When the user's words contradict such a fact, leave the slot under `## Дыры`, cite the file, and ask which one holds.
   **Done when:** each of those files that exists has been read, or the search found no primitive and the brief says so under `## Что это`; and each contradiction is under `## Дыры` with its path.

3. **Write the file.** When `brief/<slug>.md` already exists, keep every closed cell and rebuild the skeleton around it. Otherwise copy the empty slot template. Fill a slot from a user sentence, a nuance, or a citation, and list every remaining heading under `## Дыры`.
   **Done when:** the file exists, every closed cell is a quote or a path, and every unanswered slot is under `## Дыры`.

4. **Ask the frontier.** Ask the independent holes in one `AskQuestion` call, about five. The options of a question are the answers the user might give, plus "Other", and none is marked as recommended. A hole that depends on an answer still open in this batch waits. A hole with no answer set to offer (a number, a name, a sentence) is one plain-text question in the reply.
   **Done when:** that call was sent, or the text question is in the reply and you are waiting.

5. **Rewrite the file** from the answers and repeat step 4.
   **Done when:** `## Дыры` holds only postponed slots, every other slot is a quote, a citation, or «не ограничивал», and the reply links `brief/<slug>.md`.
