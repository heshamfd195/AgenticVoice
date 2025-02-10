def with_ollama(
    *,
    model: str = "llama3.1",
    base_url: str | None = "http://localhost:11434/v1",
    client: openai.AsyncClient | None = None,
    temperature: float | None = None,
    parallel_tool_calls: bool | None = None,
    tool_choice: Union[ToolChoice, Literal["auto", "required", "none"]] = "auto",
) -> LLM:
    """
    Create a new instance of Ollama LLM.
    """

    return LLM(
        model=model,
        api_key="ollama",
        base_url=base_url,
        client=client,
        temperature=temperature,
        parallel_tool_calls=parallel_tool_calls,
        tool_choice=tool_choice,
    )