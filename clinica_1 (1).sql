-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3316
-- Tempo de geração: 24/10/2025 às 13:52
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `clinica_1`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `consultas`
--

CREATE TABLE `consultas` (
  `id` int(11) NOT NULL,
  `horario_id` int(11) NOT NULL,
  `dentista_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `data_consulta` date NOT NULL,
  `procedimento` varchar(255) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `consultas`
--

INSERT INTO `consultas` (`id`, `horario_id`, `dentista_id`, `usuario_id`, `data_consulta`, `procedimento`, `observacoes`, `criado_em`) VALUES
(5, 62, 1, 1, '2025-10-11', 'Limpeza', 'Dentes perfeitos, sem necessidade de nova consulta por enquanto.', '2025-10-10 22:28:29'),
(6, 63, 1, 1, '2025-10-11', 'Extração do 22', '', '2025-10-10 22:33:34'),
(7, 69, 1, 1, '2025-10-11', 'Limpeza', 'BOM BEM LEGAL', '2025-10-10 23:35:55'),
(8, 70, 1, 1, '2025-10-13', 'Limpeza', 'Paciente precisa melhorar a escovação.', '2025-10-13 12:17:12'),
(9, 71, 1, 2, '2025-10-13', 'Limpeza', 'Tudo perfeito', '2025-10-13 12:44:14'),
(10, 76, 2, 1, '2025-10-22', 'Extração do 27', 'Escovação boa, cárie provocada apenas por excesso de alimentos prejudiciais.', '2025-10-21 18:25:15'),
(11, 75, 1, 1, '2025-10-22', '', '', '2025-10-21 18:40:25'),
(12, 77, 1, 1, '2025-10-22', '', '', '2025-10-21 18:42:11'),
(13, 80, 1, 1, '2025-10-21', 'limpeza', 'nada', '2025-10-21 19:10:40'),
(14, 86, 1, 2, '2025-10-22', '', '', '2025-10-22 11:57:49'),
(15, 94, 1, 1, '2025-10-23', '', '', '2025-10-22 13:51:57'),
(16, 101, 1, 2, '2025-10-23', 'Canal no 27', 'Melhorar escovação urgentemente', '2025-10-22 17:42:06'),
(17, 103, 2, 3, '2025-10-23', '', '', '2025-10-22 18:25:33');

-- --------------------------------------------------------

--
-- Estrutura para tabela `dentistas`
--

CREATE TABLE `dentistas` (
  `id` int(11) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `cro` varchar(30) NOT NULL,
  `cep` char(8) NOT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expira` datetime DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `codigo_2fa` varchar(6) DEFAULT NULL,
  `expira_2fa` datetime DEFAULT NULL,
  `nome_clinica` varchar(100) DEFAULT NULL,
  `cep_clinica` varchar(10) DEFAULT NULL,
  `bairro_clinica` varchar(80) DEFAULT NULL,
  `rua_clinica` varchar(120) DEFAULT NULL,
  `numero_clinica` varchar(10) DEFAULT NULL,
  `nome_completo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `dentistas`
--

INSERT INTO `dentistas` (`id`, `nome_usuario`, `email`, `senha`, `cpf`, `cro`, `cep`, `bairro`, `cidade`, `estado`, `criado_em`, `reset_token`, `reset_expira`, `telefone`, `codigo_2fa`, `expira_2fa`, `nome_clinica`, `cep_clinica`, `bairro_clinica`, `rua_clinica`, `numero_clinica`, `nome_completo`) VALUES
(1, 'Dra. Ana Dentista', 'ana@teste.com', '123456', '33333333333', 'CRO1234', '30000-00', NULL, 'Belo Horizonte', 'MG', '2025-10-01 11:49:56', NULL, NULL, '31977777777', NULL, NULL, 'Odonto Company', '21032-000', 'Bonsucesso', 'Cardoso de Moraes', '61', 'Ana Barbosa Coelho'),
(2, 'Dr. João Dentista', 'joao@teste.com', '123456', '44444444444', 'CRO5678', '40000-00', NULL, 'Salvador', 'BA', '2025-10-01 11:49:56', NULL, NULL, '71966666666', NULL, NULL, 'Centraldente', '20070-021', 'Centro', 'Buenos Aires', '159', ''),
(31, 'Dra. Bruna Lopes', 'bruna@teste.com', '123456', '20202020202', '010101010', '', NULL, NULL, NULL, '2025-10-03 11:52:37', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(32, 'Dr. Carlos Lima', 'carlo@teste.com', '123456', '20202020203', '010101011', '', NULL, NULL, NULL, '2025-10-03 11:52:37', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(33, 'Dra. Beatriz Rocha', 'beatriz@teste.com', '123456', '20202020204', '010101012', '', NULL, NULL, NULL, '2025-10-03 11:52:37', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(34, 'Dr. Felipe Alves', 'felipe@teste.com', '123456', '20202020205', '010101013', '', NULL, NULL, NULL, '2025-10-03 11:52:37', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `dentista_id` int(11) NOT NULL,
  `data` date NOT NULL,
  `hora` time NOT NULL,
  `status` enum('disponivel','ocupado') DEFAULT 'disponivel',
  `usuario_id` int(11) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `horarios`
--

INSERT INTO `horarios` (`id`, `dentista_id`, `data`, `hora`, `status`, `usuario_id`, `criado_em`, `atualizado_em`) VALUES
(62, 1, '2025-10-11', '09:00:00', '', 1, '2025-10-10 22:27:30', '2025-10-10 22:28:29'),
(63, 1, '2025-10-11', '10:00:00', '', 1, '2025-10-10 22:32:56', '2025-10-10 22:33:34'),
(69, 1, '2025-10-11', '13:00:00', '', 1, '2025-10-10 23:33:40', '2025-10-10 23:35:55'),
(70, 1, '2025-10-13', '10:00:00', '', 1, '2025-10-13 12:16:02', '2025-10-13 12:17:12'),
(71, 1, '2025-10-13', '11:00:00', '', 2, '2025-10-13 12:17:39', '2025-10-13 12:44:14'),
(75, 1, '2025-10-22', '08:00:00', '', 1, '2025-10-21 17:49:54', '2025-10-21 18:40:25'),
(76, 2, '2025-10-22', '08:00:00', '', 1, '2025-10-21 18:21:03', '2025-10-21 18:25:15'),
(77, 1, '2025-10-22', '10:00:00', '', 1, '2025-10-21 18:40:28', '2025-10-21 18:42:11'),
(80, 1, '2025-10-21', '17:00:00', '', 1, '2025-10-21 19:09:05', '2025-10-21 19:10:40'),
(86, 1, '2025-10-22', '09:00:00', '', 2, '2025-10-22 11:42:42', '2025-10-22 11:57:49'),
(94, 1, '2025-10-23', '08:00:00', '', 1, '2025-10-22 12:03:42', '2025-10-22 13:51:57'),
(101, 1, '2025-10-23', '09:00:00', '', 2, '2025-10-22 17:03:41', '2025-10-22 17:42:06'),
(103, 2, '2025-10-23', '10:00:00', '', 3, '2025-10-22 17:25:07', '2025-10-22 18:25:33'),
(106, 1, '2025-10-23', '11:00:00', 'disponivel', NULL, '2025-10-22 18:24:51', '2025-10-22 18:24:51');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `nome_mae` varchar(100) DEFAULT NULL,
  `nome_pai` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `cep` char(8) NOT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expira` datetime DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `codigo_2fa` varchar(6) DEFAULT NULL,
  `expira_2fa` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome_usuario`, `nome_mae`, `nome_pai`, `email`, `senha`, `cpf`, `cep`, `bairro`, `cidade`, `estado`, `criado_em`, `reset_token`, `reset_expira`, `telefone`, `codigo_2fa`, `expira_2fa`) VALUES
(1, 'Maria Teste', NULL, NULL, 'maria@teste.com', '123456', '11111111111', '01000-00', NULL, 'São Paulo', 'SP', '2025-10-01 11:49:56', NULL, NULL, '11999999999', NULL, NULL),
(2, 'Carlos Usuário', NULL, NULL, 'carlos@teste.com', '123456', '22222222222', '20000-00', NULL, 'Rio de Janeiro', 'RJ', '2025-10-01 11:49:56', NULL, NULL, '21988888888', NULL, NULL),
(3, 'Bruna Teste', NULL, NULL, 'brunab@gmail.com', '123456', '20200987989', '21044-31', NULL, NULL, NULL, '2025-10-22 17:12:22', NULL, NULL, '', NULL, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `consultas`
--
ALTER TABLE `consultas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horario_id` (`horario_id`),
  ADD KEY `dentista_id` (`dentista_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices de tabela `dentistas`
--
ALTER TABLE `dentistas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_nome_usuario` (`nome_usuario`),
  ADD UNIQUE KEY `u_email` (`email`),
  ADD UNIQUE KEY `u_cpf` (`cpf`),
  ADD UNIQUE KEY `u_cro` (`cro`);

--
-- Índices de tabela `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dentista` (`dentista_id`),
  ADD KEY `idx_usuario` (`usuario_id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_nome_usuario` (`nome_usuario`),
  ADD UNIQUE KEY `u_email` (`email`),
  ADD UNIQUE KEY `u_cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `consultas`
--
ALTER TABLE `consultas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `dentistas`
--
ALTER TABLE `dentistas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de tabela `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `consultas`
--
ALTER TABLE `consultas`
  ADD CONSTRAINT `consultas_ibfk_1` FOREIGN KEY (`horario_id`) REFERENCES `horarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `consultas_ibfk_2` FOREIGN KEY (`dentista_id`) REFERENCES `dentistas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `consultas_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `fk_horarios_dentista` FOREIGN KEY (`dentista_id`) REFERENCES `dentistas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_horarios_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
