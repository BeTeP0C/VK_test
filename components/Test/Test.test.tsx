import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { Test } from './Test';
import axios from 'axios';

jest.mock('axios');

describe("Test Component", () => {
  beforeEach(() => {
    if (typeof window !== 'undefined' && window.fetch) {
      jest.spyOn(window, 'fetch').mockClear();
    }
  });

  test("Рендер списка пользователей при загрузке", async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />)

    const userList = await waitFor(() => screen.findAllByTestId('user_item'));

    expect(userList).toHaveLength(2); // Проверим, что все элементы появились

    await waitFor (() => {
      // Проверим, что содержимое элементов соответствует api
      expect(screen.getByText("mojombo")).toBeInTheDocument()
      expect(screen.getByText("defunkt")).toBeInTheDocument()
    })
  })

  test('Отображение элемента загрузки при получении данных', async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />);

    // Проверяем, что элемент загрузки отображается во время запроса
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Ожидаем завершения запроса и исчезновения элемента загрузки
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });

  test('Рендер списка пользователей при прокрутке', async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers })

    render(<Test />);

    await waitFor(() => {
      expect(screen.getAllByTestId("user_item")).toHaveLength(2) // Проверим, что изначально два элемента
    })

    const userlist = screen.getByRole("user_list")
    fireEvent.scroll(userlist, { target: { scrollTop: userlist.scrollHeight - userlist.clientHeight } })

    render(<Test />);

    await waitFor(() => {
      expect(screen.getAllByTestId("user_item").length).toBeGreaterThan(2) // Проверим, что после скроллинга элементов стало больше двух
    })
  });

  test('Отображение элемента загрузки при скролле', async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />);

    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument(); // Проверим, что элемента загрузки нет
    })

    const userlist = screen.getByRole("user_list")
    fireEvent.scroll(userlist, { target: { scrollTop: userlist.scrollHeight - userlist.clientHeight } })

    // Проверяем, что элемент загрузки отображается во время запроса
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    // Ожидаем завершения запроса и исчезновения элемента загрузки
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });
  });

  test('Удаление элемента из списка', async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />);

    const userList = await waitFor(() => screen.getAllByTestId("user_item"))
    const buttonsDelete = await waitFor(() => screen.getAllByTestId("button_delete"))

    expect(userList).toHaveLength(2) // Проверим количество элементов до нажатия кнопки
    expect(buttonsDelete).toHaveLength(2)

    fireEvent.click(buttonsDelete[0])

    const newUserList = await waitFor(() => screen.getAllByTestId("user_item"))

    expect(newUserList).toHaveLength(1) // Проверим, что после нажатия количество уменьшилось
  });

  test('Сортировка пользователей по логину', async () => {
    const mockUsers = [
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />);

    const sortButton = screen.getByTestId('button_sort');

    expect(sortButton.textContent).toBe("z-a")

    fireEvent.click(sortButton);

    expect(sortButton.textContent).toBe("a-z")
  });

  test('Редактирование элемента в списке', async () => {
    const mockUsers = [
      { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
      { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockUsers });

    render(<Test />);

    await waitFor(() => {
      // Проверим, что изначально значения не изменились
      expect(screen.getByText("mojombo")).toBeInTheDocument();
      expect(screen.getByText("defunkt")).toBeInTheDocument();
    });

    const editButton = screen.getAllByTestId('button_edit',);
    fireEvent.click(editButton[0]);

    const inputField = screen.getAllByRole('textbox',);
    fireEvent.blur(inputField[0], { target: { value: "defunkt_edited" } });

    const saveButton = screen.getAllByTestId('button_save');
    fireEvent.click(saveButton[0]);

    // Завиксируем изменения
    expect(screen.getByText("defunkt_edited")).toBeInTheDocument();
    expect(screen.queryByText("defunkt")).not.toBeInTheDocument();
  });
})
