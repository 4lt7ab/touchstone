import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Background,
  Badge,
  Button,
  Code,
  Stack,
  Surface,
  SuggestionChip,
  Text,
  TypingIndicator,
} from '@touchstone/atoms';
import {
  Composer,
  EmptyState,
  Message,
  MessageActions,
  NavItem,
  NavSection,
  ToolCall,
  toast,
  useNavLayout,
} from '@touchstone/molecules';
import {
  AppBar,
  AppShell,
  Citation,
  CitationList,
  Conversation,
  Sidebar,
  ThemeSwitcher,
} from '@touchstone/organisms';
import { ThemeRhythmProvider } from '@touchstone/hooks';
import {
  BotIcon,
  PlusIcon,
  SparkleIcon,
} from '@touchstone/icons';
import {
  blackholeTheme,
  coralTheme,
  mossTheme,
  neuralTheme,
  pacmanTheme,
  pipboyTheme,
  rhythms,
  slateTheme,
  synthwaveTheme,
  terminalTheme,
  vars,
  warmSandTheme,
} from '@touchstone/themes';
import {
  replyFor,
  seedConversations,
  starterPrompts,
  type ChatConversation,
  type ChatMessage,
  type MessagePart,
} from './data.js';

interface ThemeOption {
  key: string;
  label: string;
  className: string;
  scene?: 'synthwave' | 'blackhole' | 'neural' | 'pipboy' | 'pacman';
}

const themeOptions: ThemeOption[] = [
  { key: 'warm-sand', label: 'Warm sand', className: warmSandTheme },
  { key: 'slate', label: 'Slate', className: slateTheme },
  { key: 'moss', label: 'Moss', className: mossTheme },
  { key: 'coral', label: 'Coral', className: coralTheme },
  { key: 'synthwave', label: 'Synthwave', className: synthwaveTheme, scene: 'synthwave' },
  { key: 'terminal', label: 'Terminal', className: terminalTheme },
  { key: 'pipboy', label: 'Pip-Boy', className: pipboyTheme, scene: 'pipboy' },
  { key: 'neural', label: 'Neural', className: neuralTheme, scene: 'neural' },
  { key: 'blackhole', label: 'Blackhole', className: blackholeTheme, scene: 'blackhole' },
  { key: 'pacman', label: 'Pac-Man', className: pacmanTheme, scene: 'pacman' },
];

const STREAM_INTERVAL_MS = 28;
const TOOL_PAUSE_MS = 700;

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function App() {
  const [themeKey, setThemeKey] = useState<string>('warm-sand');
  const [conversations, setConversations] = useState<ChatConversation[]>(() => seedConversations());
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? '');
  const [streaming, setStreaming] = useState(false);
  const timersRef = useRef<number[]>([]);

  const theme = useMemo(
    () => themeOptions.find((t) => t.key === themeKey) ?? themeOptions[0]!,
    [themeKey],
  );

  useEffect(() => {
    document.body.className = theme.className;
    document.body.style.background = vars.color.bgPage;
    document.body.style.color = vars.color.fg;
  }, [theme]);

  useEffect(
    () => () => {
      for (const id of timersRef.current) window.clearTimeout(id);
      timersRef.current = [];
    },
    [],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const patchConversation = useCallback(
    (id: string, patch: (c: ChatConversation) => ChatConversation) => {
      setConversations((prev) => prev.map((c) => (c.id === id ? patch(c) : c)));
    },
    [],
  );

  const appendMessage = useCallback(
    (id: string, message: ChatMessage) => {
      patchConversation(id, (c) => ({
        ...c,
        messages: [...c.messages, message],
        preview: message.parts
          .filter((p): p is Extract<MessagePart, { kind: 'text' }> => p.kind === 'text')
          .map((p) => p.body)
          .join(' ')
          .slice(0, 80),
        updatedAt: 'just now',
      }));
    },
    [patchConversation],
  );

  const updateMessage = useCallback(
    (conversationId: string, messageId: string, patch: (m: ChatMessage) => ChatMessage) => {
      patchConversation(conversationId, (c) => ({
        ...c,
        messages: c.messages.map((m) => (m.id === messageId ? patch(m) : m)),
      }));
    },
    [patchConversation],
  );

  const startStreamingReply = useCallback(
    (conversationId: string, prompt: string) => {
      const parts = replyFor(prompt);
      const assistantId = makeId('msg');
      const assistantMessage: ChatMessage = {
        id: assistantId,
        author: 'assistant',
        authorName: 'Touchstone Guide',
        parts: [],
        state: 'streaming',
        timestamp: formatTime(),
      };
      appendMessage(conversationId, assistantMessage);
      setStreaming(true);

      const ordered: MessagePart[] = parts.map((p) => ({ ...p }));
      const accumulated: MessagePart[] = [];

      function commitPart(idx: number) {
        const target = ordered[idx];
        if (!target) {
          updateMessage(conversationId, assistantId, (m) => ({ ...m, state: 'complete' }));
          setStreaming(false);
          return;
        }
        if (target.kind === 'text') {
          accumulated.push({ ...target, body: '' });
          updateMessage(conversationId, assistantId, (m) => ({ ...m, parts: [...accumulated] }));
          let pos = 0;
          const step = () => {
            pos += 2;
            const next = target.body.slice(0, pos);
            const replacement = [...accumulated];
            replacement[replacement.length - 1] = { ...target, body: next };
            accumulated.splice(0, accumulated.length, ...replacement);
            updateMessage(conversationId, assistantId, (m) => ({ ...m, parts: [...accumulated] }));
            if (pos < target.body.length) {
              const t = window.setTimeout(step, STREAM_INTERVAL_MS);
              timersRef.current.push(t);
            } else {
              const t = window.setTimeout(() => commitPart(idx + 1), STREAM_INTERVAL_MS * 2);
              timersRef.current.push(t);
            }
          };
          step();
        } else if (target.kind === 'tool') {
          const pendingTool: MessagePart = { ...target, status: 'pending', result: undefined };
          accumulated.push(pendingTool);
          updateMessage(conversationId, assistantId, (m) => ({ ...m, parts: [...accumulated] }));
          const t = window.setTimeout(() => {
            const resolved: MessagePart = { ...target };
            const replacement = [...accumulated];
            replacement[replacement.length - 1] = resolved;
            accumulated.splice(0, accumulated.length, ...replacement);
            updateMessage(conversationId, assistantId, (m) => ({ ...m, parts: [...accumulated] }));
            const t2 = window.setTimeout(() => commitPart(idx + 1), STREAM_INTERVAL_MS * 2);
            timersRef.current.push(t2);
          }, TOOL_PAUSE_MS);
          timersRef.current.push(t);
        } else {
          accumulated.push(target);
          updateMessage(conversationId, assistantId, (m) => ({ ...m, parts: [...accumulated] }));
          const t = window.setTimeout(() => commitPart(idx + 1), STREAM_INTERVAL_MS);
          timersRef.current.push(t);
        }
      }

      commitPart(0);
    },
    [appendMessage, updateMessage],
  );

  const sendPrompt = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || !active) return;
      const userMessage: ChatMessage = {
        id: makeId('msg'),
        author: 'user',
        authorName: 'You',
        parts: [{ kind: 'text', id: makeId('part'), body: value }],
        state: 'complete',
        timestamp: formatTime(),
      };
      appendMessage(active.id, userMessage);
      window.setTimeout(() => startStreamingReply(active.id, value), 320);
    },
    [active, appendMessage, startStreamingReply],
  );

  const newConversation = useCallback(() => {
    const id = makeId('conv');
    const next: ChatConversation = {
      id,
      title: 'Untitled conversation',
      preview: 'No messages yet',
      updatedAt: 'just now',
      messages: [],
    };
    setConversations((prev) => [next, ...prev]);
    setActiveId(id);
  }, []);

  const onCopy = useCallback((message: ChatMessage) => {
    const text = message.parts
      .filter((p): p is Extract<MessagePart, { kind: 'text' }> => p.kind === 'text')
      .map((p) => p.body)
      .join('');
    void navigator.clipboard?.writeText(text);
    toast({ tone: 'success', title: 'Copied to clipboard' });
  }, []);

  const onRegenerate = useCallback(
    (message: ChatMessage) => {
      if (!active) return;
      const idx = active.messages.findIndex((m) => m.id === message.id);
      const previousUser = [...active.messages.slice(0, idx)]
        .reverse()
        .find((m) => m.author === 'user');
      const trimmed: ChatMessage[] = active.messages.slice(0, idx);
      patchConversation(active.id, (c) => ({ ...c, messages: trimmed }));
      if (previousUser) {
        const prompt = previousUser.parts
          .filter((p): p is Extract<MessagePart, { kind: 'text' }> => p.kind === 'text')
          .map((p) => p.body)
          .join(' ');
        window.setTimeout(() => startStreamingReply(active.id, prompt), 200);
      }
    },
    [active, patchConversation, startStreamingReply],
  );

  const rateMessage = useCallback(
    (message: ChatMessage, kind: 'like' | 'dislike') => {
      if (!active) return;
      updateMessage(active.id, message.id, (m) => ({
        ...m,
        liked: kind === 'like' ? !m.liked : false,
        disliked: kind === 'dislike' ? !m.disliked : false,
      }));
    },
    [active, updateMessage],
  );

  const rhythmName = themeKey as keyof typeof rhythms;
  const rhythm = rhythmName in rhythms ? rhythms[rhythmName] : null;

  return (
    <ThemeRhythmProvider rhythm={rhythm}>
      {theme.scene ? <Background scene={theme.scene} pulse /> : null}
      <div style={{ position: 'relative', height: '100vh' }}>
        <AppShell
          mainPadding={false}
          header={
            <AppBar
              sticky
              brand={
                <Stack direction="row" align="center" gap="sm">
                  <Avatar shape="square" size="sm" tone="accent">
                    <BotIcon size={14} />
                  </Avatar>
                  <Text weight="semibold" size="lg">
                    Touchstone Chat
                  </Text>
                </Stack>
              }
              actions={
                <Stack direction="row" align="center" gap="sm">
                  <ThemeSwitcher
                    options={themeOptions}
                    value={themeKey}
                    onChange={setThemeKey}
                  />
                  <Button intent="primary" size="sm" icon={<PlusIcon size={14} />} onClick={newConversation}>
                    New chat
                  </Button>
                </Stack>
              }
            />
          }
          sidebar={
            <Sidebar
              width="md"
              header={<ChatSidebarUserHeader />}
              footer={<ChatSidebarFooter />}
            >
              <NavSection label="Conversations">
                {conversations.map((c) => (
                  <NavItem
                    key={c.id}
                    size="sm"
                    selected={c.id === activeId}
                    onClick={() => setActiveId(c.id)}
                    icon={
                      <Avatar
                        size="sm"
                        monogram={c.title.charAt(0).toUpperCase()}
                        aria-hidden="true"
                      />
                    }
                    trailing={
                      c.id === activeId ? <Badge tone="accent">now</Badge> : undefined
                    }
                  >
                    {c.title}
                  </NavItem>
                ))}
              </NavSection>
            </Sidebar>
          }
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {active ? (
              <Conversation
                aria-label={`Conversation: ${active.title}`}
                width="reading"
                typing={
                  streaming && active.messages.at(-1)?.parts.length === 0 ? (
                    <Stack direction="row" gap="sm" align="center">
                      <Avatar tone="accent" size="md">
                        <BotIcon size={14} />
                      </Avatar>
                      <TypingIndicator />
                    </Stack>
                  ) : undefined
                }
                emptyState={
                  <EmptyState>
                    <EmptyState.Icon>
                      <SparkleIcon size={28} />
                    </EmptyState.Icon>
                    <EmptyState.Title>How can I help today?</EmptyState.Title>
                    <EmptyState.Description>
                      Try a starter, or just type below. The assistant streams its reply token by
                      token, and can call tools or cite sources as it goes.
                    </EmptyState.Description>
                    <EmptyState.Actions>
                      <Stack direction="row" gap="sm" wrap justify="center">
                        {starterPrompts.map((p) => (
                          <SuggestionChip key={p} onClick={() => sendPrompt(p)}>
                            {p}
                          </SuggestionChip>
                        ))}
                      </Stack>
                    </EmptyState.Actions>
                  </EmptyState>
                }
                composer={
                  <Composer
                    onSubmit={sendPrompt}
                    state={streaming ? 'streaming' : 'idle'}
                    placeholder="Ask anything — Enter to send, Shift+Enter for a newline"
                    metaSlot={streaming ? 'streaming…' : `model · touchstone-guide`}
                  />
                }
              >
                {active.messages.map((m) => renderMessage(m, {
                  onCopy: () => onCopy(m),
                  onRegenerate: () => onRegenerate(m),
                  onLike: () => rateMessage(m, 'like'),
                  onDislike: () => rateMessage(m, 'dislike'),
                }))}
              </Conversation>
            ) : (
              <EmptyState level="page">
                <EmptyState.Title>Pick a conversation</EmptyState.Title>
                <EmptyState.Description>
                  Or hit New chat in the toolbar to start fresh.
                </EmptyState.Description>
              </EmptyState>
            )}
          </div>
        </AppShell>
      </div>
    </ThemeRhythmProvider>
  );
}

function ChatSidebarUserHeader(): React.JSX.Element {
  const { collapsed } = useNavLayout();
  if (collapsed) {
    return (
      <Stack direction="row" justify="center">
        <Avatar size="md" monogram="AL" aria-label="Ada Lovelace" />
      </Stack>
    );
  }
  return (
    <Surface padding="sm" radius="md" level="muted">
      <Stack direction="row" align="center" gap="sm">
        <Avatar size="md" monogram="AL" />
        <Stack direction="column" gap="none">
          <Text size="sm" weight="medium">
            Ada Lovelace
          </Text>
          <Text size="xs" tone="muted">
            free tier · 12 / 25 chats
          </Text>
        </Stack>
      </Stack>
    </Surface>
  );
}

function ChatSidebarFooter(): React.JSX.Element | null {
  const { collapsed } = useNavLayout();
  if (collapsed) return null;
  return (
    <Text size="xs" tone="muted">
      Touchstone Chat · demo
    </Text>
  );
}

interface MessageActionsBinding {
  onCopy: () => void;
  onRegenerate: () => void;
  onLike: () => void;
  onDislike: () => void;
}

function renderMessage(message: ChatMessage, bindings: MessageActionsBinding): React.JSX.Element {
  const isAssistant = message.author === 'assistant';
  const showActions = isAssistant && message.state === 'complete';
  const citations = message.parts.filter(
    (p): p is Extract<MessagePart, { kind: 'citation' }> => p.kind === 'citation',
  );

  return (
    <Message
      key={message.id}
      author={message.author}
      authorName={message.authorName}
      timestamp={message.timestamp || undefined}
      state={message.state}
      actions={
        showActions ? (
          <MessageActions
            onCopy={bindings.onCopy}
            onRegenerate={bindings.onRegenerate}
            onLike={bindings.onLike}
            onDislike={bindings.onDislike}
            liked={message.liked}
            disliked={message.disliked}
          />
        ) : message.author === 'user' ? (
          <MessageActions onCopy={bindings.onCopy} />
        ) : undefined
      }
    >
      <Stack direction="column" gap="sm">
        {renderParts(message.parts)}
        {showActions && citations.length > 0 ? (
          <CitationList
            items={citations.map((c) => ({
              index: c.index,
              title: c.title,
              snippet: c.snippet,
              ...(c.href ? { href: c.href } : {}),
            }))}
          />
        ) : null}
      </Stack>
    </Message>
  );
}

function renderParts(parts: MessagePart[]): React.JSX.Element {
  const blocks: React.JSX.Element[] = [];
  let inline: React.JSX.Element[] = [];
  let key = 0;

  const flushInline = () => {
    if (inline.length === 0) return;
    blocks.push(
      <span key={`inline-${key++}`}>
        {inline}
      </span>,
    );
    inline = [];
  };

  for (const part of parts) {
    if (part.kind === 'text') {
      inline.push(<span key={part.id}>{part.body}</span>);
    } else if (part.kind === 'citation') {
      inline.push(
        <Citation
          key={part.id}
          index={part.index}
          title={part.title}
          snippet={part.snippet}
          {...(part.href ? { href: part.href } : {})}
        />,
      );
    } else if (part.kind === 'tool') {
      flushInline();
      blocks.push(
        <ToolCall
          key={part.id}
          name={part.name}
          status={part.status}
          args={
            part.args ? (
              <Code block language="json">
                {JSON.stringify(part.args, null, 2)}
              </Code>
            ) : undefined
          }
          result={part.result}
        />,
      );
    }
  }
  flushInline();
  return <>{blocks}</>;
}
